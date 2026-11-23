"use client";

import { useState } from "react";
import { CLINICIAN_NAME as CLINICIAN, MARKERS, Patient, ShareCategory, TODAY } from "./data";

// Preview of the Daygo iOS app's clinic connection. Colours follow the iOS
// Theme tokens (bg #0A0A0A, surface #141414, accent lime #D4FF4A).
const fmt = (iso: string) => new Date(iso.slice(0, 10) + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export function PatientPhone({ p, onShare, onRevoke, onCheckIn, onUpload, flash }: {
  onUpload: () => void;
  p: Patient;
  onShare: (c: ShareCategory, v: boolean) => void;
  onRevoke: () => void;
  onCheckIn: (mood: number, energy: number, symptom: string | null) => void;
  flash: boolean;
}) {
  const [tab, setTab] = useState<"home" | "tests" | "plan" | "sharing">("home");
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [sym, setSym] = useState<string | null>(null);
  const today = p.days.at(-1);
  const checkedIn = today?.mood != null;
  const upcoming = p.retests.filter((r) => r.status !== "done").sort((a, b) => a.due.localeCompare(b.due));
  const revoked = p.status === "revoked";

  return (
    <div className="mx-auto w-[300px] shrink-0 rounded-[46px] bg-[#111] p-[7px] shadow-[0_30px_60px_-20px_rgba(31,38,29,.45)] ring-1 ring-black/40">
      <div className="relative h-[610px] overflow-hidden rounded-[40px] bg-[#0A0A0A] text-[#F5F5F2]">
        <div className="absolute left-1/2 top-2.5 z-20 h-[26px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
        <div className="flex items-center justify-between px-7 pt-3.5 text-[12px] font-semibold"><span>9:41</span><span>●●● ▮</span></div>
        <div className="h-[528px] overflow-y-auto px-4 pb-4 pt-6 text-[13px]">
          {revoked ? (
            <div className="mt-24 text-center"><div className="text-[17px] font-semibold">Clinic access stopped</div><p className="mt-2 text-[#A6A6A6]">You stopped sharing with the clinic. Your own data stays in Daygo.</p></div>
          ) : tab === "home" ? (
            <>
              <div className="text-[11px] uppercase tracking-wider text-[#A6A6A6]">Connected to Example Clinic</div>
              <div className="mt-1 text-[22px] font-semibold leading-tight">Hi {p.first}</div>
              <div className={`mt-4 rounded-[24px] bg-[#D4FF4A] p-4 text-[#161913] transition-all duration-500 ${flash ? "scale-[1.03] ring-4 ring-[#D4FF4A]/40" : ""}`}>
                <div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">What your clinician is watching</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.update.watching.length ? p.update.watching.map((w) => <span key={w} className="rounded-full bg-[#161913] px-2.5 py-1 text-[12px] font-medium text-[#D4FF4A]">{w}</span>) : <span className="opacity-70">Nothing set yet</span>}
                </div>
                {p.update.notes[0] && <p className="mt-3 text-[13px] leading-snug">“{p.update.notes[0].text}”<span className="mt-1 block text-[11px] opacity-60">{p.update.notes[0].by} · {fmt(p.update.notes[0].at)}</span></p>}
              </div>
              <div className="mt-3 rounded-[24px] bg-[#141414] p-4">
                <div className="font-semibold">Today's check-in</div>
                {checkedIn ? <p className="mt-1 text-[#A6A6A6]">Done. Mood {today!.mood}/5, energy {today!.energy}/5.</p> : (
                  <>
                    {[["Mood", mood, setMood], ["Energy", energy, setEnergy]].map(([l, v, set]) => (
                      <div key={l as string} className="mt-3"><div className="text-[12px] text-[#A6A6A6]">{l as string}</div>
                        <div className="mt-1 flex gap-1.5">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => (set as (n: number) => void)(n)} className={`h-8 flex-1 rounded-xl text-[13px] ${v === n ? "bg-[#D4FF4A] text-[#161913]" : "bg-[#1E1E1E]"}`}>{n}</button>)}</div></div>
                    ))}
                    <div className="mt-3 flex flex-wrap gap-1.5">{["Tiredness", "Headache", "Stress", "None"].map((s) => <button key={s} onClick={() => setSym(s)} className={`rounded-full px-2.5 py-1 text-[12px] ${sym === s ? "bg-[#D4FF4A] text-[#161913]" : "bg-[#1E1E1E]"}`}>{s}</button>)}</div>
                    <button disabled={!mood || !energy} onClick={() => onCheckIn(mood!, energy!, sym && sym !== "None" ? sym : null)} className="mt-3 w-full rounded-full bg-[#F5F5F2] py-2 text-[13px] font-semibold text-[#161913] disabled:opacity-30">Save (10 sec)</button>
                  </>
                )}
              </div>
              {upcoming[0] && <div className="mt-3 rounded-[24px] bg-[#141414] p-4"><div className="text-[12px] text-[#A6A6A6]">Next test</div><div className="mt-0.5 font-semibold">{upcoming[0].label}</div><div className="text-[12px] text-[#A6A6A6]">{upcoming[0].due < TODAY ? "Due since " : "Due "}{fmt(upcoming[0].due)}</div></div>}
              {p.nextVisit && <div className="mt-3 rounded-[24px] bg-[#141414] p-4"><div className="text-[12px] text-[#A6A6A6]">Next visit</div><div className="mt-0.5 font-semibold">{fmt(p.nextVisit)} · {p.nextVisit.slice(11)}</div><div className="text-[12px] text-[#A6A6A6]">{CLINICIAN}</div></div>}
            </>
          ) : tab === "tests" ? (
            <>
              <div className="text-[22px] font-semibold">Tests</div>
              <div className="mt-3 space-y-2">{upcoming.map((r) => (
                <div key={r.id} className="rounded-[20px] bg-[#141414] p-3.5">
                  <div className="flex justify-between"><b className="font-semibold">{r.label}</b><span className="text-[12px] text-[#A6A6A6]">{fmt(r.due)}</span></div>
                  <div className="mt-1 text-[11px] text-[#A6A6A6]">{r.source === "guideline" ? "Guideline: " + r.sourceDetail.split("·")[0] : "Set by " + r.sourceDetail}</div>
                  {r.status === "result_in" ? <div className="mt-2 text-[12px] text-[#D4FF4A]">Result received</div> : <button className="mt-2 rounded-full bg-[#1E1E1E] px-3 py-1 text-[12px]">Book retest</button>}
                </div>))}</div>
              <div className="mt-4 text-[12px] uppercase tracking-wider text-[#A6A6A6]">My results</div>
              {Object.keys(MARKERS).filter((m) => p.labs.some((l) => l.marker === m)).map((m) => {
                const ls = p.labs.filter((l) => l.marker === m).sort((a, b) => a.date.localeCompare(b.date));
                return <div key={m} className="mt-2 flex justify-between rounded-[16px] bg-[#141414] px-3.5 py-2.5"><span>{MARKERS[m].name}</span><span className="text-[#A6A6A6]">{ls.map((l) => l.value).join(" → ")} {MARKERS[m].unit}</span></div>;
              })}
              <button onClick={onUpload} className="mt-3 w-full rounded-full border border-white/15 py-2 text-[13px]">Upload a new result (example)</button>
            </>
          ) : tab === "plan" ? (
            <>
              <div className="text-[22px] font-semibold">My plan</div>
              <div className={`mt-3 space-y-2 transition ${flash ? "opacity-60" : ""}`}>
                {p.update.plan.map((c) => <div key={c.id} className="rounded-[20px] bg-[#141414] p-3.5"><div>{c.text}</div><div className="mt-1 text-[11px] text-[#A6A6A6]">Added {fmt(c.at)}</div></div>)}
                {!p.update.plan.length && <p className="text-[#A6A6A6]">No plan changes yet.</p>}
              </div>
              <div className="mt-4 text-[12px] uppercase tracking-wider text-[#A6A6A6]">Notes from your clinician</div>
              {p.update.notes.map((n) => <div key={n.id} className="mt-2 rounded-[20px] bg-[#141414] p-3.5"><div>{n.text}</div><div className="mt-1 text-[11px] text-[#A6A6A6]">{n.by} · {fmt(n.at)}</div></div>)}
            </>
          ) : (
            <>
              <div className="text-[22px] font-semibold">Sharing</div>
              <p className="mt-1 text-[#A6A6A6]">Choose what Example Clinic can see. You can change this any time.</p>
              {([["wearables", "Wearables", "Sleep, HRV, heart rate, steps"], ["checkins", "Check-ins", "Mood, energy, symptoms, food"], ["tests", "Blood tests", "Uploaded results"]] as const).map(([k, l, d]) => (
                <label key={k} className="mt-2 flex cursor-pointer items-center justify-between rounded-[20px] bg-[#141414] p-3.5">
                  <span><b className="block font-semibold">{l}</b><span className="text-[12px] text-[#A6A6A6]">{d}</span></span>
                  <input type="checkbox" checked={p.sharing[k]} onChange={(e) => onShare(k, e.target.checked)} className="h-5 w-5 accent-[#D4FF4A]" />
                </label>
              ))}
              <button onClick={onRevoke} className="mt-5 w-full rounded-full border border-[#F2647D]/50 py-2 text-[13px] text-[#F2647D]">Stop sharing with this clinic</button>
            </>
          )}
        </div>
        {!revoked && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-around rounded-full bg-[#1E1E1E] p-1.5 text-[11px]">
            {(["home", "tests", "plan", "sharing"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full py-1.5 capitalize ${tab === t ? "bg-[#D4FF4A] font-semibold text-[#161913]" : "text-[#A6A6A6]"}`}>{t}</button>)}
          </div>
        )}
      </div>
    </div>
  );
}
