"use client";

// Live mode: real clinicians, real patients, via the clinic-api function.
// The demo (data.ts) stays available at /clinic?demo=1.
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { DayPoint, LabResult, MARKERS, Patient, Retest } from "./data";

// Public project URL + anon key (same values the iOS app ships with).
const URL = "https://mqnvqzbvnxmvbesbwkbd.supabase.co";
// Public anon key (safe to ship; RLS + clinic-api checks protect data).
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbnZxemJ2bnhtdmJlc2J3a2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMDc1NDksImV4cCI6MjA5MTY4MzU0OX0.iIlfuWv2QyAB9pf8OFbGNHu7bKuvOeyingSfrxQ-mVg";

let client: SupabaseClient | null = null;
export function sb(): SupabaseClient {
  if (!client) client = createClient(URL, ANON || "missing-anon-key", { auth: { persistSession: true, autoRefreshToken: true } });
  return client;
}

export async function api<T = any>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const { data } = await sb().auth.getSession();
  const token = data.session?.access_token;
  const r = await fetch(`${URL}/functions/v1/clinic-api`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: ANON, Authorization: `Bearer ${token ?? ANON}` },
    body: JSON.stringify({ action, ...body }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.message ?? j.error ?? `Request failed (${r.status})`);
  return j as T;
}

// App lab kinds → dashboard marker keys where they overlap. Values from the
// app are in its own units; ranges are only shown for markers we know.
const KIND_TO_MARKER: Record<string, string> = {
  ferritin: "ferritin", vitamin_d_blood: "vitamin-d", hba1c: "hba1c", tsh: "tsh", hemoglobin: "hemoglobin", crp: "crp", vitamin_b12_blood: "b12",
};
const APP_UNITS: Record<string, string> = {
  ldl: "mg/dL", hdl: "mg/dL", total_cholesterol: "mg/dL", triglycerides: "mg/dL", fasting_glucose: "mg/dL", hba1c: "%", ferritin: "ng/mL",
  vitamin_d_blood: "ng/mL", vitamin_b12_blood: "pg/mL", tsh: "mIU/L", hemoglobin: "g/dL", crp: "mg/L", hs_crp: "mg/L", creatinine: "mg/dL",
};
function markerKey(kind: string): string {
  const k = KIND_TO_MARKER[kind] ?? kind;
  if (!MARKERS[k]) {
    const name = kind.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bLdl\b/, "LDL").replace(/\bHdl\b/, "HDL").replace(/\bCrp\b/, "CRP");
    MARKERS[k] = { name, unit: APP_UNITS[kind] ?? "", lo: NaN, hi: NaN };
  } else if (kind === "hemoglobin") {
    // The app stores hemoglobin in g/dL; the demo range is g/L.
    MARKERS[k] = { ...MARKERS[k], unit: "g/dL", lo: 12, hi: 15.5 };
  }
  return k;
}

const COLORS = ["#4C6B4F", "#7A6A4F", "#4F5F7A", "#7A4F5F", "#5F7A4F", "#4F7A72"];
const isoDay = (d: string) => d.slice(0, 10);

/** clinic-api patient payload → the dashboard's Patient shape. */
export function toPatient(p: any, i: number, clinicianName: string): Patient {
  const prof = p.profile ?? {};
  const name = String(prof.name ?? p.label ?? "Patient").trim();
  const [first, ...rest] = name.split(/\s+/);
  const byDay = new Map<string, DayPoint>();
  const dayOf = (day: string) => {
    if (!byDay.has(day)) {
      const dow = new Date(day + "T12:00:00").getDay();
      byDay.set(day, { date: day, sleepH: null, hrv: null, eveningHrv: null, rhr: null, steps: null, mood: null, energy: null, symptoms: [], workday: dow >= 1 && dow <= 5 });
    }
    return byDay.get(day)!;
  };
  for (const h of p.health ?? []) {
    const d = dayOf(h.day);
    d.sleepH = h.sleep_min != null ? Math.round((h.sleep_min / 60) * 10) / 10 : null;
    d.hrv = h.hrv_ms != null ? Math.round(h.hrv_ms) : null;
    d.rhr = h.resting_hr != null ? Math.round(h.resting_hr) : null;
    d.steps = h.active_kcal != null ? Math.round(h.active_kcal) : null; // active kcal shown where the demo had steps
  }
  for (const l of p.logs ?? []) {
    const d = dayOf(isoDay(l.occurred_at));
    const pl = l.payload ?? {};
    const inner = pl.mood ?? pl.symptom ?? pl.food ?? pl;
    if (l.kind === "mood") d.mood = Number(inner?._0?.score ?? inner?.score ?? pl.score) || d.mood;
    if (l.kind === "symptom") d.symptoms.push(String(inner?._0?.kind ?? inner?.kind ?? "Symptom"));
    if (l.kind === "food") d.food = String(inner?._0?.label ?? inner?.label ?? "Meal");
    if (l.note) d.note = String(l.note);
  }
  const days = [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));

  const reviewedAt = p.labs_reviewed_at ? isoDay(p.labs_reviewed_at) : "";
  const labs: LabResult[] = (p.labs ?? []).map((b: any) => ({
    marker: markerKey(b.kind), value: Number(b.value), date: isoDay(b.measured_at),
    reportId: `${p.patient_id}-${isoDay(b.measured_at)}`, reviewed: !!reviewedAt && isoDay(b.created_at ?? b.measured_at) <= reviewedAt,
    uploadedBy: "patient", lab: b.note || "Lab report",
  }));

  const ups = (p.updates ?? []) as any[];
  const watching = ups.find((u) => u.kind === "watching")?.watching ?? [];
  const retests: Retest[] = ups.filter((u) => u.kind === "retest").map((u) => ({
    id: u.id, marker: markerKey(u.retest_marker || "general"), label: u.text || `${MARKERS[markerKey(u.retest_marker || "general")]?.name ?? "Test"} retest`,
    due: u.retest_due, source: "clinician", sourceDetail: clinicianName, status: u.retest_status ?? "scheduled",
  }));
  const lastSync = (p.health ?? []).length ? `data to ${(p.health as any[]).at(-1).day}` : "No data yet";
  return {
    id: p.patient_id, first: first || "Patient", last: rest.join(" "), age: Number(prof.age) || 0, sex: prof.sex === "female" ? "F" : "M",
    programme: p.programme || "Programme", device: p.scopes?.wearables ? "Apple Health" : "Not shared", lastSync,
    enrolled: isoDay(p.consented_at ?? new Date().toISOString()),
    status: days.length ? "data_flowing" : "joined",
    sharing: { wearables: !!p.scopes?.wearables, checkins: !!p.scopes?.checkins, tests: !!p.scopes?.tests },
    lastVisit: p.last_visit_at ? isoDay(p.last_visit_at) : isoDay(p.consented_at ?? new Date().toISOString()),
    nextVisit: p.next_visit_at ? p.next_visit_at.slice(0, 16) : null,
    days, labs, retests,
    update: {
      watching,
      plan: ups.filter((u) => u.kind === "plan").map((u) => ({ id: u.id, text: u.text, at: isoDay(u.created_at) })),
      notes: ups.filter((u) => u.kind === "note").map((u) => ({ id: u.id, text: u.text, at: isoDay(u.created_at), by: clinicianName })),
    },
    color: COLORS[i % COLORS.length],
    archived: !!p.archived_at,
    patientNotes: (p.patient_notes ?? []).map((n: any) => ({ id: n.id, text: n.text, at: isoDay(n.shared_at), ai: !!n.prepared_with_ai })),
  };
}
