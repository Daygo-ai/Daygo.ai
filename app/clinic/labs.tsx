"use client";

import { useRef, useState } from "react";
import { DEMO_EXTRACT, LabResult, MARKERS, Patient, TODAY } from "./data";

export interface LabReport {
  id: string;
  p: Patient;
  date: string;
  lab: string;
  uploadedBy: "patient" | "clinic";
  values: (LabResult & { prev?: LabResult })[];
  reviewed: boolean;
}

const fmt = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** All lab reports for a patient, newest first, each value paired with the previous value of that marker. */
export function reportsOf(p: Patient): LabReport[] {
  const byId = new Map<string, LabResult[]>();
  p.labs.forEach((l) => { const k = l.reportId ?? `${p.id}-${l.date}`; byId.set(k, [...(byId.get(k) ?? []), l]); });
  return [...byId.entries()].map(([id, ls]) => ({
    id, p, date: ls[0].date, lab: ls[0].lab ?? "Lab", uploadedBy: ls[0].uploadedBy ?? "clinic",
    reviewed: ls.every((l) => l.reviewed),
    values: ls.map((l) => ({ ...l, prev: p.labs.filter((x) => x.marker === l.marker && x.date < l.date).sort((a, b) => b.date.localeCompare(a.date))[0] })),
  })).sort((a, b) => b.date.localeCompare(a.date));
}

export const toReview = (ps: Patient[]) => ps.filter((p) => p.sharing.tests).flatMap(reportsOf).filter((r) => !r.reviewed).sort((a, b) => b.date.localeCompare(a.date));

/** The lab's own range, shown as printed. Not an interpretation. */
export function RangeFlag({ v, marker }: { v: number; marker: string }) {
  const m = MARKERS[marker];
  if (!m) return null;
  if (v < m.lo) return <span className="rounded-md border border-current px-1 py-px text-[10px] font-semibold opacity-70" title="Below the lab's printed range">L</span>;
  if (v > m.hi) return <span className="rounded-md border border-current px-1 py-px text-[10px] font-semibold opacity-70" title="Above the lab's printed range">H</span>;
  return null;
}

export function ReportTable({ r, compact = false, dark = false }: { r: LabReport; compact?: boolean; dark?: boolean }) {
  const mu = dark ? "text-white/60" : "text-[#5A6168]", mu2 = dark ? "text-white/45" : "text-[#7A8189]", sub = dark ? "text-white/75" : "text-[#3A4148]", ln = dark ? "border-white/10" : "border-[#111518]/[.06]";
  return (
    <table className="w-full text-left text-[14px]">
      {!compact && <thead><tr className={`text-[12px] ${mu}`}><th className="py-1.5 font-medium">Marker</th><th className="py-1.5 font-medium">Result</th><th className="py-1.5 font-medium">Previous</th><th className="py-1.5 font-medium">Lab range</th></tr></thead>}
      <tbody>{r.values.map((v) => {
        const m = MARKERS[v.marker];
        return (
          <tr key={v.marker} className={`border-t ${ln}`}>
            <td className="py-2 pr-2 font-medium">{m.name}</td>
            <td className="py-2 pr-2 tabular-nums"><b className="font-semibold">{v.value}</b> <span className={mu}>{m.unit}</span> <RangeFlag v={v.value} marker={v.marker} /></td>
            <td className={`py-2 pr-2 tabular-nums ${sub}`}>{v.prev ? <>{v.prev.value} <span className={`text-[12px] ${mu2}`}>{new Date(v.prev.date).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}</span> <span className="ml-1">{v.value > v.prev.value ? "↑" : v.value < v.prev.value ? "↓" : "="}</span></> : <span className={mu2}>first result</span>}</td>
            <td className={`py-2 ${mu}`}>{Number.isFinite(m.lo) && Number.isFinite(m.hi) ? `${m.lo}–${m.hi}` : "—"}</td>
          </tr>);
      })}</tbody>
    </table>
  );
}

export function reportMeta(r: LabReport) {
  return `${fmt(r.date)} · ${r.lab} · ${r.uploadedBy === "patient" ? `uploaded by ${r.p.first}` : "added by clinic"}`;
}

/** Add a lab report: pick a PDF/photo, demo extraction fills values, clinician checks and saves. */
export function UploadModal({ patients, initialPid, onClose, onSave }: {
  patients: Patient[]; initialPid?: string; onClose: () => void;
  onSave: (pid: string, date: string, lab: string, values: { marker: string; value: number }[]) => void;
}) {
  const [pid, setPid] = useState(initialPid ?? patients[0]?.id);
  const [file, setFile] = useState<string | null>(null);
  const [stage, setStage] = useState<"pick" | "reading" | "check">("pick");
  const [rows, setRows] = useState<{ marker: string; value: string }[]>([]);
  const [date, setDate] = useState(TODAY);
  const [lab, setLab] = useState("Example Lab");
  const input = useRef<HTMLInputElement>(null);
  const pick = (name: string) => {
    setFile(name); setStage("reading");
    setTimeout(() => { setRows(DEMO_EXTRACT.map((d) => ({ marker: d.marker, value: String(d.value) }))); setStage("check"); }, 1200);
  };
  const field = "w-full rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-[14px] outline-none focus:border-[#111518]/40";
  const valid = rows.filter((r) => r.value.trim() && !isNaN(+r.value));
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#111518]/30 p-4 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-labelledby="up-t">
      <div className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-[28px] border border-white/70 bg-[#EEF1F3]/95 p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-start justify-between"><h2 id="up-t" className="text-[22px] font-semibold">Add lab report</h2><button onClick={onClose} aria-label="Close" className="text-[22px] leading-none text-[#5A6168]">×</button></div>
        <label className="mt-4 block text-[13px] font-medium">Patient
          <select value={pid} onChange={(e) => setPid(e.target.value)} className={`${field} mt-1`}>{patients.map((p) => <option key={p.id} value={p.id}>{p.first} {p.last}</option>)}</select>
        </label>

        {stage === "pick" && (
          <button onClick={() => input.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) pick(f.name); }}
            className="mt-4 grid w-full place-items-center rounded-[22px] border-2 border-dashed border-[#111518]/20 bg-white/50 px-6 py-10 text-center transition hover:bg-white/80">
            <span className="text-[28px]">⇪</span>
            <span className="mt-2 font-semibold">Drop the lab PDF or a photo</span>
            <span className="text-[13px] text-[#5A6168]">or click to choose a file</span>
            <input ref={input} type="file" accept="application/pdf,image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f.name); }} />
          </button>
        )}
        {stage === "pick" && <button onClick={() => pick("Example-lab-report.pdf")} className="mt-2 text-[13px] underline underline-offset-2">Use an example report</button>}

        {stage === "reading" && <div className="mt-6 rounded-[22px] bg-white/60 p-8 text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#111518]/15 border-t-[#111518]" /><div className="mt-3 font-medium">Reading {file}…</div></div>}

        {stage === "check" && (
          <>
            <div className="mt-4 rounded-2xl bg-white/60 px-4 py-3 text-[13px]"><b className="font-semibold">{file}</b><span className="block text-[#5A6168]">Check the values against the report before saving.</span></div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="text-[13px] font-medium">Sample date<input type="date" value={date} max={TODAY} onChange={(e) => setDate(e.target.value)} className={`${field} mt-1`} /></label>
              <label className="text-[13px] font-medium">Laboratory<input value={lab} onChange={(e) => setLab(e.target.value)} className={`${field} mt-1`} /></label>
            </div>
            <div className="mt-3 space-y-2">{rows.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <select value={r.marker} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, marker: e.target.value } : x)))} className={field}>{Object.entries(MARKERS).map(([k, m]) => <option key={k} value={k}>{m.name}</option>)}</select>
                <input inputMode="decimal" value={r.value} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} className={`${field} w-28`} aria-label="Value" />
                <span className="w-16 text-[12px] text-[#5A6168]">{MARKERS[r.marker].unit}</span>
                <button onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label="Remove" className="text-[18px] text-[#5A6168]">×</button>
              </div>))}
            </div>
            <button onClick={() => setRows([...rows, { marker: "b12", value: "" }])} className="mt-2 text-[13px] font-medium underline underline-offset-2">+ Add a value</button>
            <p className="mt-3 text-[12px] text-[#5A6168]">Demo: values are pre-filled from an example. Reading real reports comes in the pilot.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-full border border-[#111518]/15 px-4 py-2 text-[14px]">Cancel</button>
              <button disabled={!pid || !valid.length} onClick={() => onSave(pid!, date, lab, valid.map((r) => ({ marker: r.marker, value: +r.value })))} className="rounded-full bg-[#111518] px-5 py-2 text-[14px] font-medium text-white disabled:opacity-40">Save {valid.length} values</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
