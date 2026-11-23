"use client";

import { useState } from "react";
import { DayPoint } from "./data";

const fmtDay = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });

type Key = "sleepH" | "hrv" | "eveningHrv" | "rhr" | "steps";

function Tip({ t }: { t: { x: number; text: string } | null }) {
  if (!t) return null;
  return (
    <div className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-white px-2.5 text-[#111518] py-1.5 text-[12px] shadow-lg"
      style={{ left: `${t.x}%` }}>{t.text}</div>
  );
}

/** One metric across the range. Bars for sleep/steps, line for the rest. */
export function MetricChart({ days, k, unit, color = "#111518", kind = "line", dec = 0, height = 96 }: {
  days: DayPoint[]; k: Key; unit: string; color?: string; kind?: "line" | "bar"; dec?: number; height?: number;
}) {
  const [tip, setTip] = useState<{ x: number; text: string } | null>(null);
  const vals = days.map((d) => d[k]);
  const v = vals.filter((x): x is number => x != null);
  if (!v.length) return <div className="py-8 text-center text-sm text-white/60">No data shared</div>;
  const W = 100, H = height;
  let mn = kind === "bar" ? 0 : Math.min(...v), mx = Math.max(...v);
  const pad = (mx - mn || 1) * 0.15; if (kind !== "bar") mn -= pad; mx += pad;
  const x = (i: number) => (days.length === 1 ? 50 : (i / (days.length - 1)) * W);
  const y = (n: number) => H - 4 - ((n - mn) / (mx - mn)) * (H - 10);
  const avgV = v.reduce((a, b) => a + b, 0) / v.length;
  const pts = vals.map((n, i) => (n == null ? null : [x(i), y(n)] as const)).filter(Boolean) as [number, number][];
  const bw = Math.max(0.6, (W / days.length) * 0.6);
  return (
    <div className="relative" onMouseLeave={() => setTip(null)}>
      <Tip t={tip} />
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block w-full" style={{ height: H }}>
        <line x1="0" x2={W} y1={y(avgV)} y2={y(avgV)} stroke="#ffffff" strokeOpacity=".18" strokeDasharray="1.5 1.5" vectorEffect="non-scaling-stroke" />
        {kind === "bar"
          ? vals.map((n, i) => n == null ? null : (
              <rect key={i} x={x(i) - bw / 2} y={y(n)} width={bw} height={H - 4 - y(n)} rx={0.4} fill={color} fillOpacity={i === vals.length - 1 ? 1 : 0.55} />))
          : <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />}
        {days.map((d, i) => (
          <rect key={"h" + i} x={x(i) - W / days.length / 2} y={0} width={W / days.length} height={H} fill="transparent"
            onMouseEnter={() => setTip({ x: x(i), text: `${fmtDay(d.date)}: ${d[k] == null ? "no data" : (d[k] as number).toFixed(dec) + " " + unit}` })} />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-white/50"><span>{fmtDay(days[0].date)}</span><span>avg {avgV.toFixed(dec)} {unit}</span><span>{fmtDay(days.at(-1)!.date)}</span></div>
    </div>
  );
}

/** Wearables and how the patient feels, on one shared time axis. */
export function WholePicture({ days }: { days: DayPoint[] }) {
  const [tip, setTip] = useState<{ x: number; text: string } | null>(null);
  if (!days.length) return <div className="py-10 text-center text-sm text-white/60">No data shared yet</div>;
  const n = days.length;
  const cell = (i: number) => ({ left: `${(i / n) * 100}%`, width: `${100 / n}%` });
  const show = (i: number) => {
    const d = days[i];
    setTip({ x: ((i + 0.5) / n) * 100, text: `${fmtDay(d.date)}${d.workday ? "" : " (weekend)"} · sleep ${d.sleepH ?? "–"} h · HRV ${d.hrv ?? "–"} ms · eve HRV ${d.eveningHrv ?? "–"} · mood ${d.mood ?? "–"}/5 · energy ${d.energy ?? "–"}/5${d.symptoms.length ? " · " + d.symptoms.join(", ") : ""}${d.note ? ` · “${d.note}”` : ""}` });
  };
  const row = (label: string, render: (d: DayPoint, i: number) => React.ReactNode, h = 22) => (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0 text-[12px] text-white/70">{label}</div>
      <div className="relative flex-1" style={{ height: h }}>
        {days.map((d, i) => <div key={i} className="absolute top-0 flex h-full items-center justify-center" style={cell(i)} onMouseEnter={() => show(i)}>{render(d, i)}</div>)}
      </div>
    </div>
  );
  const scale = (v: number | null, lo: number, hi: number) => (v == null ? 0 : Math.max(0.08, Math.min(1, (v - lo) / (hi - lo))));
  const count = (f: (d: DayPoint) => boolean) => days.filter(f).length;
  const actVals = days.map((d) => d.steps).filter((x): x is number => x != null);
  const actMax = Math.max(1, ...actVals);
  const sq = (v: number | null) => v == null ? <span className="h-1 w-1 rounded-full bg-white/20" /> : <span className="h-[70%] w-[70%] max-w-[16px] rounded-[3px]" style={{ background: `rgba(230,228,108,${0.15 + v / 5 * 0.85})` }} />;

  // Only rows with data are drawn; everything else is listed as missing, so
  // gaps read as "not shared / not recorded" instead of a broken chart.
  const rows = [
    { key: "Sleep", n: count((d) => d.sleepH != null), el: () => row("Sleep", (d) => <div className="w-[70%] self-end rounded-t-[2px] bg-[#7E95B8]" style={{ height: `${scale(d.sleepH, 4, 9) * 100}%` }} />, 34) },
    { key: "HRV overnight", n: count((d) => d.hrv != null), el: () => row("HRV overnight", (d) => <div className="w-[70%] self-end rounded-t-[2px] bg-[#E6E46C]" style={{ height: `${scale(d.hrv, 15, 80) * 100}%` }} />, 34) },
    { key: "HRV 16–17h", n: count((d) => d.eveningHrv != null), el: () => row("HRV 16–17h", (d) => <div className="w-[70%] self-end rounded-t-[2px] bg-[#B98A4E]" style={{ height: `${scale(d.eveningHrv, 15, 80) * 100}%` }} />, 34) },
    { key: "Resting heart rate", n: count((d) => d.rhr != null), el: () => row("Resting HR", (d) => d.rhr == null ? null : <span className="text-[10px] tabular-nums text-white/75">{d.rhr}</span>) },
    { key: "Activity", n: actVals.length, el: () => row("Activity", (d) => <div className="w-[70%] self-end rounded-t-[2px] bg-white/45" style={{ height: `${d.steps == null ? 0 : Math.max(6, (d.steps / actMax) * 100)}%` }} />, 28) },
    { key: "Mood", n: count((d) => d.mood != null), el: () => row("Mood", (d) => sq(d.mood)) },
    { key: "Energy", n: count((d) => d.energy != null), el: () => row("Energy", (d) => sq(d.energy)) },
    { key: "Symptoms", n: count((d) => d.symptoms.length > 0), el: () => row("Symptoms", (d) => d.symptoms.length ? <span className="h-2 w-2 rounded-full bg-[#B65C4A]" /> : null) },
    { key: "Notes", n: count((d) => !!d.note), el: () => row("Notes", (d) => d.note ? <span className="h-2 w-2 rotate-45 bg-white" /> : null) },
  ];
  const shown = rows.filter((r) => r.n > 0);
  const missing = rows.filter((r) => r.n === 0).map((r) => r.key);
  const partial = shown.filter((r) => r.n < n * 0.6 && r.key !== "Symptoms" && r.key !== "Notes").map((r) => `${r.key} on ${r.n} of ${n} days`);
  return (
    <div className="relative space-y-1.5" onMouseLeave={() => setTip(null)}>
      <div className="relative ml-[124px]"><Tip t={tip} /></div>
      {shown.length ? <>
        {row("Workdays", (d) => <div className={`h-1.5 w-[80%] rounded-full ${d.workday ? "bg-white/30" : ""}`} />, 8)}
        {shown.map((r) => <div key={r.key}>{r.el()}</div>)}
        <div className="flex justify-between pl-[124px] pt-1 text-[11px] text-white/50"><span>{fmtDay(days[0].date)}</span><span>{fmtDay(days.at(-1)!.date)}</span></div>
      </> : <div className="py-6 text-center text-sm text-white/60">Nothing recorded in this period.</div>}
      {(missing.length > 0 || partial.length > 0) && (
        <div className="mt-3 rounded-xl bg-white/[.05] px-3 py-2 text-[12px] leading-relaxed text-white/65">
          {missing.length > 0 && <div><span className="text-white/85">Not recorded:</span> {missing.join(", ")}</div>}
          {partial.length > 0 && <div><span className="text-white/85">Gaps:</span> {partial.join(" · ")}</div>}
        </div>
      )}
    </div>
  );
}

export function LabHistory({ points, lo: lo0, hi: hi0, unit }: { points: { date: string; value: number }[]; lo: number; hi: number; unit: string }) {
  // Markers without a known range (live data): fall back to the values' own span.
  const known = Number.isFinite(lo0) && Number.isFinite(hi0);
  const lo = known ? lo0 : Math.min(...points.map((p) => p.value));
  const hi = known ? hi0 : Math.max(...points.map((p) => p.value));
  const W = 300, H = 120;
  const vals = points.map((p) => p.value);
  const mn = Math.min(lo, ...vals) * 0.85, mx = Math.max(Math.min(hi, Math.max(...vals) * 2), ...vals) * 1.05;
  const x = (i: number) => (points.length === 1 ? W / 2 : 20 + (i / (points.length - 1)) * (W - 40));
  const y = (v: number) => H - 20 - ((v - mn) / (mx - mn)) * (H - 34);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {known && <rect x="0" width={W} y={y(Math.min(hi, mx))} height={Math.max(0, y(lo) - y(Math.min(hi, mx)))} fill="#ffffff" fillOpacity=".08" />}
      {known && <text x="4" y={y(lo) - 3} fontSize="9" fill="rgba(255,255,255,.55)">lab range from {lo}</text>}
      <polyline points={points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ")} fill="none" stroke="#ffffff" strokeWidth="2" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.value)} r="4" fill="#ffffff" />
          <text x={x(i)} y={y(p.value) - 9} fontSize="10" textAnchor="middle" fill="#ffffff" fontWeight="600">{p.value}</text>
          <text x={x(i)} y={H - 4} fontSize="9" textAnchor="middle" fill="rgba(255,255,255,.55)">{new Date(p.date).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}</text>
        </g>
      ))}
      <text x={W - 4} y="10" fontSize="9" textAnchor="end" fill="rgba(255,255,255,.55)">{unit}</text>
    </svg>
  );
}
