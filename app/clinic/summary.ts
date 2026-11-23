// Simulated "AI" summary for Phase 1. Deterministic, rule-based, factual.
// Phase 2 replaces this with an LLM call that receives the same inputs and
// the same constraints: describe changes only, never diagnose, classify risk
// or recommend tests/treatment.

import { DayPoint, MARKERS, Patient, TODAY } from "./data";

export const avg = (a: (number | null)[]) => {
  const v = a.filter((x): x is number => x != null);
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null;
};

export function sinceLastVisit(p: Patient): DayPoint[] {
  return p.days.filter((d) => d.date > p.lastVisit);
}

export function summarise(p: Patient): { bullets: string[]; quotes: { date: string; text: string }[]; missing: string[] } {
  const since = sinceLastVisit(p);
  const bullets: string[] = [];
  const missing: string[] = [];
  if (!since.length) return { bullets: ["No data shared since the last visit."], quotes: [], missing: ["Wearable and check-in data"] };

  const half = Math.floor(since.length / 2);
  const first = since.slice(0, half), second = since.slice(half);
  const cmp = (k: keyof DayPoint, label: string, unit: string, dec = 0) => {
    const a = avg(first.map((d) => d[k] as number | null)), b = avg(second.map((d) => d[k] as number | null));
    if (a == null || b == null) return;
    const diff = b - a;
    const word = Math.abs(diff) < (dec ? 0.15 : 1.5) ? "stayed about the same" : diff > 0 ? "went up" : "went down";
    bullets.push(`${label} ${word}: ${a.toFixed(dec)} → ${b.toFixed(dec)} ${unit} (first vs second half of the period).`);
  };
  cmp("sleepH", "Average sleep", "h", 1);
  cmp("hrv", "Overnight HRV", "ms");

  const wd = since.filter((d) => d.workday), we = since.filter((d) => !d.workday);
  const ew = avg(wd.map((d) => d.eveningHrv)), ee = avg(we.map((d) => d.eveningHrv));
  if (ew != null && ee != null && ee - ew > 5)
    bullets.push(`HRV between 16:00 and 17:00 averaged ${ew.toFixed(0)} ms on workdays and ${ee.toFixed(0)} ms on weekends.`);

  const logged = since.filter((d) => d.mood != null).length;
  bullets.push(`Checked in on ${logged} of ${since.length} days.`);
  if (logged / since.length < 0.4) missing.push("Few check-ins since the last visit");

  const symCount: Record<string, number> = {};
  since.forEach((d) => d.symptoms.forEach((s) => (symCount[s] = (symCount[s] || 0) + 1)));
  const syms = Object.entries(symCount).sort((a, b) => b[1] - a[1]);
  if (syms.length) bullets.push("Symptoms logged: " + syms.map(([s, n]) => `${s} (${n} days)`).join(", ") + ".");

  const newLabs = p.labs.filter((l) => l.date > p.lastVisit);
  newLabs.forEach((l) => {
    const prev = p.labs.filter((x) => x.marker === l.marker && x.date < l.date).sort((a, b) => b.date.localeCompare(a.date))[0];
    const m = MARKERS[l.marker];
    bullets.push(prev ? `New ${m.name} result: ${l.value} ${m.unit} (previous ${prev.value} ${m.unit}). Lab range ${m.lo}–${m.hi}.` : `New ${m.name} result: ${l.value} ${m.unit}. Lab range ${m.lo}–${m.hi}.`);
  });

  p.retests.filter((r) => r.due < TODAY && r.status !== "result_in" && r.status !== "done").forEach((r) => missing.push(`${r.label} was due ${r.due}`));
  if (!p.sharing.tests) missing.push("Patient is not sharing test results");

  const quotes = since.filter((d) => d.note).slice(-3).reverse().map((d) => ({ date: d.date, text: d.note! }));
  return { bullets, quotes, missing };
}

export function oneLine(p: Patient): string {
  if (p.status === "invited") return "Invited, not joined yet";
  if (!p.days.length) return "Joined, waiting for first data";
  const last7 = p.days.slice(-7);
  const ci = last7.filter((d) => d.mood != null).length;
  const s7 = avg(last7.map((d) => d.sleepH)), s30 = avg(p.days.slice(-30).map((d) => d.sleepH));
  const parts = [`${ci}/7 check-ins`];
  if (s7 != null && s30 != null) {
    const m = Math.round((s7 - s30) * 60);
    parts.push(Math.abs(m) < 10 ? `sleep steady ${s7.toFixed(1)} h` : `sleep ${m > 0 ? "up" : "down"} ${Math.abs(m)} min`);
  }
  const res = p.retests.find((r) => r.status === "result_in");
  if (res) parts.push(`${res.label.replace(" retest", "")} result in`);
  return parts.join(" · ");
}

export function lastCheckIn(p: Patient): number | null {
  for (let i = p.days.length - 1; i >= 0; i--) if (p.days[i].mood != null) return p.days.length - 1 - i;
  return null;
}
