"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, CLINICIAN_NAME as CLINICIAN, DEMO_PATIENTS, MARKERS, Patient, PROGRAMMES, Retest, TODAY, WATCH_OPTIONS } from "./data";
import { avg, lastCheckIn, oneLine, sinceLastVisit, summarise } from "./summary";
import { LabHistory, WholePicture } from "./charts";
import { PatientPhone } from "./PatientPhone";
import QRCode from "qrcode";
import { api, sb, toPatient } from "./live";
import { setLiveContext } from "./data";
import { DotColumns, RouteTerrain } from "./terrain";
import { reportMeta, reportsOf, ReportTable, RangeFlag, toReview, UploadModal } from "./labs";
import { ACCENT, liquid as apple, LiquidGlassDefs, GRAD, gradStyle, Icon, StatCard } from "./glass";
import { AuraCurve, AuraPill, changePill, FrostBackground, glass, glassDark, iconBtn, pill, pillOn } from "./glass";

type View = "today" | "patients" | "tests" | "add";
const KEY = "daygo_clinic_demo_v1";
const fmt = (iso: string, o: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) => new Date(iso.slice(0, 10) + "T12:00:00").toLocaleDateString("en-GB", o);
const uid = () => Math.random().toString(36).slice(2, 9);
const daysFrom = (iso: string) => Math.round((new Date(iso.slice(0, 10) + "T12:00:00").getTime() - new Date(TODAY + "T12:00:00").getTime()) / 864e5);

const card = `${glass} p-6`;
const btnPri = "inline-flex items-center gap-2 rounded-full bg-[#E6E46C] px-5 py-2.5 text-[14px] font-semibold text-[#111518] shadow-[0_10px_24px_-10px_rgba(0,0,0,.5)] transition hover:brightness-105 active:scale-[.98]";
const btnSec = "inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[.14] px-3.5 py-1.5 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.3)] backdrop-blur-xl backdrop-saturate-150 transition hover:bg-white/25 active:scale-[.98]";
const btnSecL = "inline-flex items-center gap-2 rounded-full border border-[#111518]/15 bg-white/60 px-3.5 py-1.5 text-[13px] font-medium text-[#111518] transition hover:bg-white active:scale-[.98]";
const mono = "text-[11px] font-semibold uppercase tracking-[.12em] text-white/55";

function Burger() {
  return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}

function Avatar({ p, size = 36 }: { p: Patient; size?: number }) {
  return <div className="grid shrink-0 place-items-center rounded-full font-semibold text-white" style={{ width: size, height: size, background: p.color, fontSize: size * 0.36 }}>{p.first[0]}{p.last[0]}</div>;
}

/** Set once live mode is ready; actions also write to clinic-api when present. */
let LIVE: { clinicId: string; clinicName: string; me: string } | null = null;

type Mode = "loading" | "login" | "setup" | "live" | "demo";
/** The demo (fictional patients) only on localhost, or with ?demo=1 for sales calls. */
const showDemo = () => typeof window !== "undefined" && (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) || new URLSearchParams(window.location.search).has("demo"));

function LiveGate({ mode, onDemo, onCreated }: { mode: Mode; onDemo: () => void; onCreated: () => void }) {
  const [email, setEmail] = useState(""), [sent, setSent] = useState(false), [err, setErr] = useState("");
  const [clinic, setClinic] = useState(""), [me, setMe] = useState("");
  const [demoOK, setDemoOK] = useState(false);
  useEffect(() => setDemoOK(showDemo()), []);
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/clinic` : undefined;
  const box = "w-full max-w-[420px] rounded-[28px] border border-white/20 bg-white/[.08] p-8 text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] backdrop-blur-[30px]";
  const input = "mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-[15px] text-white outline-none placeholder:text-white/40 focus:border-white/50";
  const btn = "mt-4 w-full rounded-full bg-[#E6E46C] py-2.5 text-[15px] font-semibold text-[#111518] disabled:opacity-40";
  return (
    <div className="relative isolate grid min-h-screen place-items-center px-4">
      <FrostBackground />
      <div className={box}>
        <img src="/clinic/daygo-white.svg" alt="Daygo" className="h-[16px] w-auto" />
        <div className="mt-1 text-[11px] uppercase tracking-[.2em] text-white/55">Clinics</div>
        {mode === "loading" && <p className="mt-8 text-white/70">Loading…</p>}
        {mode === "login" && (sent ? (
          <p className="mt-8 text-[15px] text-white/85">Check {email} for a sign-in link. Open it on this computer.</p>
        ) : (
          <>
            <h1 className="mt-8 text-[28px] font-light leading-tight">Sign in to your clinic</h1>
            <label className="mt-5 block text-[13px] text-white/70">Work email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@clinic.lt" className={input} /></label>
            <button disabled={!email.includes("@")} className={btn} onClick={async () => {
              setErr("");
              const { error } = await sb().auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: redirectTo } });
              if (error) setErr(error.message); else setSent(true);
            }}>Email me a sign-in link</button>
            <button className="mt-2 w-full rounded-full border border-white/25 py-2.5 text-[15px] text-white" onClick={() => sb().auth.signInWithOAuth({ provider: "google", options: { redirectTo } })}>Continue with Google</button>
          </>
        ))}
        {mode === "setup" && (
          <>
            <h1 className="mt-8 text-[28px] font-light leading-tight">Set up your clinic</h1>
            <label className="mt-5 block text-[13px] text-white/70">Clinic name<input value={clinic} onChange={(e) => setClinic(e.target.value)} className={input} /></label>
            <label className="mt-3 block text-[13px] text-white/70">Your name, as patients will see it<input value={me} onChange={(e) => setMe(e.target.value)} placeholder="Dr. …" className={input} /></label>
            <button disabled={!clinic.trim() || !me.trim()} className={btn} onClick={async () => {
              try { await api("create_clinic", { name: clinic.trim(), display_name: me.trim() }); onCreated(); } catch (e) { setErr(String((e as Error).message)); }
            }}>Create clinic</button>
          </>
        )}
        {err && <p className="mt-3 text-[13px] text-[#FFB4A6]">{err}</p>}
        {mode === "setup" && <button onClick={() => sb().auth.signOut().then(() => location.reload())} className="mt-4 block text-[13px] text-white/60 underline underline-offset-2">Use a different account</button>}
        {demoOK && <button onClick={onDemo} className="mt-6 text-[13px] text-white/60 underline underline-offset-2">Try the demo with example patients</button>}
        <p className="mt-6 text-[12px] leading-relaxed text-white/45">Access is by invitation (hello@daygo.ai). Patient data is shown only with each patient&apos;s consent, hosted in the EU.</p>
      </div>
    </div>
  );
}

export default function ClinicApp() {
  const [patients, setPatients] = useState<Patient[]>(DEMO_PATIENTS);
  const [view, setView] = useState<View>("today");
  const [pid, setPid] = useState<string | null>(null);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phonePid, setPhonePid] = useState("p0");
  const [flash, setFlash] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [uploadFor, setUploadFor] = useState<string | null | undefined>(undefined);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => { const ua = navigator.userAgent; if (/Chrome|Chromium|Edg\//.test(ua) && !/Firefox/.test(ua)) document.documentElement.classList.add("lg-on"); }, []);
  useEffect(() => { try { setCollapsed(localStorage.getItem("dgc_sidebar") === "1"); } catch {} }, []);
  useEffect(() => { if (loaded) try { localStorage.setItem("dgc_sidebar", collapsed ? "1" : "0"); } catch {} }, [collapsed, loaded]);

  const [mode, setMode] = useState<Mode>("loading");
  const loadLive = async () => {
    try {
      const me = await api<{ memberships: { clinic_id: string; display_name: string | null; clinics: { name: string } }[] }>("me");
      if (!me.memberships.length) { setMode("setup"); return; }
      const m = me.memberships[0];
      LIVE = { clinicId: m.clinic_id, clinicName: m.clinics?.name ?? "Clinic", me: m.display_name ?? "Clinician" };
      setLiveContext(LIVE.me);
      const r = await api<{ patients: any[] }>("roster", { clinic_id: m.clinic_id, days: 90 });
      setPatients(r.patients.map((p, i) => toPatient(p, i, LIVE!.me)));
      if (r.patients[0]) setPhonePid(r.patients[0].patient_id);
      setMode("live");
    } catch (e) { setToast(String((e as Error).message)); setMode("login"); }
  };
  // Live mode keeps itself fresh: every minute and whenever the tab regains focus.
  useEffect(() => {
    if (mode !== "live") return;
    const refresh = async () => {
      if (!LIVE) return;
      try {
        const r = await api<{ patients: any[] }>("roster", { clinic_id: LIVE.clinicId, days: 90 });
        setPatients(r.patients.map((p, i) => toPatient(p, i, LIVE!.me)));
      } catch { /* keep what we have */ }
    };
    const t = setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    return () => { clearInterval(t); window.removeEventListener("focus", refresh); };
  }, [mode]);
  const startDemo = () => {
    LIVE = null;
    try { const s = localStorage.getItem(KEY); if (s) setPatients(JSON.parse(s)); } catch {}
    setMode("demo");
  };
  useEffect(() => {
    if (showDemo() && new URLSearchParams(window.location.search).has("demo")) { startDemo(); setLoaded(true); return; }
    sb().auth.getSession().then(({ data }) => { if (data.session) loadLive(); else setMode("login"); setLoaded(true); });
    const { data: sub } = sb().auth.onAuthStateChange((ev) => { if (ev === "SIGNED_IN") loadLive(); });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (loaded && mode === "demo") try { localStorage.setItem(KEY, JSON.stringify(patients)); } catch {} }, [patients, loaded, mode]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2400); return () => clearTimeout(t); }, [toast]);

  const patch = (id: string, fn: (p: Patient) => Patient) => setPatients((ps) => ps.map((p) => (p.id === id ? fn(structuredClone(p)) : p)));
  const open = (id: string) => { setPid(id); setView("patients"); setPhonePid(id); window.scrollTo({ top: 0 }); };
  const remind = (p: Patient, what: string) => setToast(LIVE ? `${p.first}'s app will show "${what}" (push reminders coming soon)` : `Reminder sent to ${p.first}: ${what} (demo)`);
  const sendToApp = (id: string) => { setPhonePid(id); setPhoneOpen(true); setFlash(true); setTimeout(() => setFlash(false), 1200); };
  const saveLabs = (pid: string, date: string, lab: string, values: { marker: string; value: number }[], by: "patient" | "clinic" = "clinic") => {
    const reportId = `${pid}-${date}-${uid()}`;
    patch(pid, (p) => {
      p.labs = [...p.labs, ...values.map((v) => ({ ...v, date, lab, reportId, reviewed: false, uploadedBy: by }))];
      p.retests = p.retests.map((r) => (values.some((v) => v.marker === r.marker) && r.status !== "done" ? { ...r, status: "result_in" } : r));
      return p;
    });
    const p = patients.find((x) => x.id === pid);
    setUploadFor(undefined);
    setToast(`${values.length} results added for ${p?.first}. Waiting for review.`);
  };
  const review = (pid: string, reportId: string) => {
    patch(pid, (p) => {
      const ms = p.labs.filter((l) => l.reportId === reportId).map((l) => l.marker);
      p.labs = p.labs.map((l) => (l.reportId === reportId ? { ...l, reviewed: true } : l));
      p.retests = p.retests.map((r) => (r.status === "result_in" && ms.includes(r.marker) ? { ...r, status: "done" } : r));
      return p;
    });
    if (LIVE) api("mark_labs_reviewed", { clinic_id: LIVE.clinicId, patient_id: pid }).catch((e) => setToast(e.message));
    setToast("Lab report marked as reviewed");
  };
  const reset = () => { localStorage.removeItem(KEY); setPatients(DEMO_PATIENTS); setPid(null); setView("today"); setToast("Demo reset"); };

  useEffect(() => { const f = (e: Event) => { setView((e as CustomEvent).detail); setPid(null); }; document.addEventListener("dg-nav", f); return () => document.removeEventListener("dg-nav", f); }, []);
  const current = patients.find((p) => p.id === pid) ?? null;
  const phoneP = patients.find((p) => p.id === phonePid) ?? patients[0];
  const nav: [View, string][] = [["today", "Today"], ["patients", "Patients"], ["tests", "Tests"], ["add", "Add patient"]];

  if (mode === "loading" || mode === "login" || mode === "setup") return <LiveGate mode={mode} onDemo={startDemo} onCreated={loadLive} />;

  return (
    <div className="relative isolate min-h-screen text-[#111518] antialiased">
      <FrostBackground />
      <LiquidGlassDefs />
      <button onClick={() => setCollapsed(false)} aria-label="Open navigation" title="Open navigation"
        className={`fixed left-4 top-4 z-40 hidden h-12 w-12 place-items-center rounded-full border border-white/25 bg-white/[.1] text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,.6),inset_0_1px_0_rgba(255,255,255,.3)] backdrop-blur-[24px] transition duration-300 hover:scale-105 hover:bg-white/20 lg:grid ${collapsed ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0"}`}>
        <Burger />
      </button>
      <aside aria-hidden={collapsed} className={`fixed inset-y-3 left-3 z-30 hidden w-[230px] origin-top-left flex-col overflow-hidden liquid bend rounded-[30px] border border-white/[.12] bg-[rgba(20,20,22,.18)] p-5 text-white shadow-[inset_1px_1px_0_rgba(255,255,255,.26),inset_-1px_-1px_0_rgba(255,255,255,.07),0_30px_60px_-30px_rgba(0,0,0,.6)] transition-all duration-300 ease-out lg:flex ${collapsed ? "pointer-events-none scale-[.2] opacity-0" : "scale-100 opacity-100"}`}>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(160deg,rgba(255,255,255,.16),rgba(255,255,255,.03)_45%,rgba(255,255,255,.08))]" />
        {/* Same screen spot as the collapsed dot (16px, 16px, 48px), so one click opens and closes */}
        <div className="-ml-4 -mt-4 flex h-12 items-center gap-1">
          <button onClick={() => setCollapsed(true)} aria-label="Hide navigation" title="Hide navigation" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white/80 transition hover:text-white"><Burger /></button>
          <img src="/clinic/daygo-white.svg" alt="Daygo" className="h-[13px] w-auto" />
          <span className="ml-2 border-l border-white/25 pl-2.5 text-[10px] font-medium uppercase leading-none tracking-[.2em] text-white/55">Clinics</span>
        </div>
        <nav className="mt-7 flex flex-col gap-1">
          {nav.map(([v, l]) => (
            <button key={v} onClick={() => { setView(v); setPid(null); }} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] transition ${view === v ? "bg-white/20 font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.25)] backdrop-blur" : "text-white/85 hover:bg-white/10"}`}>
              <Icon n={({ today: "home", patients: "user", tests: "flask", add: "plus" } as const)[v]} /><span className="whitespace-nowrap">{l}</span>
            </button>
          ))}
          <div className="mx-3 my-3 h-px bg-white/15" />
          <button onClick={() => setPhoneOpen((o) => !o)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] transition ${phoneOpen ? "bg-white/20 font-medium" : "text-white/85 hover:bg-white/10"}`}><Icon n="phone" /><span className="whitespace-nowrap">Patient view</span></button>
        </nav>
        <div className="mt-auto space-y-2">
          {!LIVE && <div className="rounded-full bg-white/15 px-3 py-1 text-center text-[11px] font-semibold uppercase tracking-wider text-white/80">Example data</div>}
          <div className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 text-[13px]"><Icon n="clinic" className="h-4 w-4" />{LIVE ? LIVE.clinicName : "Example Clinic"}</div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-[13px]"><span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-[11px] font-semibold">{(LIVE?.me ?? "EV").split(/\s+/).map((w) => w[0]).join("").slice(0, 2)}</span>{LIVE ? LIVE.me : "Dr. E. Vaitkienė"}</div>
        </div>
      </aside>
      <header className="sticky top-0 z-30 border-b border-white/15 bg-white/10 text-white backdrop-blur-2xl lg:hidden">
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-3">
          <img src="/clinic/daygo-white.svg" alt="Daygo" className="mr-2 h-[14px] w-auto shrink-0" />
          {nav.map(([v, l]) => <button key={v} onClick={() => { setView(v); setPid(null); }} className={`whitespace-nowrap ${view === v ? pillOn : pill}`}>{l}</button>)}
          <button onClick={() => setPhoneOpen((o) => !o)} className={phoneOpen ? pillOn : pill}>📱</button>
        </div>
      </header>

      <div className={`flex gap-5 px-4 pb-16 pt-4 transition-[margin] duration-300 ease-out lg:pr-4 lg:pt-3 ${collapsed ? "lg:ml-[72px]" : "lg:ml-[246px]"}`}>
        <main className={`min-w-0 flex-1 px-1 text-white md:px-6`}>
          {view === "today" && <Today patients={patients} open={open} remind={remind} upload={(id) => setUploadFor(id ?? null)} review={review} />}
          {view === "patients" && !current && <Directory patients={patients} open={open} />}
          {view === "patients" && current && <Profile p={current} upload={() => setUploadFor(current.id)} review={review} back={() => setPid(null)} patch={(fn) => patch(current.id, fn)} sendToApp={() => sendToApp(current.id)} remind={remind} toast={setToast} />}
          {view === "tests" && <Tests patients={patients} open={open} remind={remind} patch={patch} />}
          {view === "add" && <AddPatient onAdd={(p) => { setPatients((ps) => [...ps, p]); setToast(`${p.first} invited`); }} patients={patients} open={open} />}
          <div className={`mt-10 flex flex-wrap items-center gap-3 border-t pt-5 text-[12px] border-white/15 text-white/55`}>
            <span>All patients and data are fictional example data. Daygo shows what patients share. Clinicians make every clinical decision.</span>
            {LIVE ? <button onClick={() => sb().auth.signOut().then(() => location.reload())} className="ml-auto underline underline-offset-2">Sign out</button> : <button onClick={reset} className="ml-auto underline underline-offset-2">Reset demo</button>}
          </div>
        </main>

        {phoneOpen && (
          <aside className="fixed inset-x-0 bottom-0 z-40 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-[#E8EDDF] p-5 shadow-2xl lg:sticky lg:top-3 lg:z-auto lg:h-fit lg:max-h-none lg:w-[310px] lg:shrink-0 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
            <div className="mb-3 flex items-center gap-2">
              <span className={mono}>Patient app preview</span>
              <select value={phonePid} onChange={(e) => setPhonePid(e.target.value)} className="ml-auto rounded-full bg-white/70 px-2 py-1 text-[12px] ring-1 ring-[#111518]/10">
                {patients.filter((p) => p.status !== "invited").map((p) => <option key={p.id} value={p.id}>{p.first} {p.last}</option>)}
              </select>
              <button onClick={() => setPhoneOpen(false)} className="text-[18px] lg:hidden" aria-label="Close">×</button>
            </div>
            <PatientPhone key={phoneP.id} p={phoneP} flash={flash}
              onShare={(c, v) => { patch(phoneP.id, (p) => { p.sharing[c] = v; return p; }); setToast(`${phoneP.first} turned ${v ? "on" : "off"} sharing: ${c}`); }}
              onRevoke={() => { patch(phoneP.id, (p) => { p.status = "revoked"; p.sharing = { wearables: false, checkins: false, tests: false }; return p; }); setToast(`${phoneP.first} stopped sharing with the clinic`); }}
              onUpload={() => saveLabs(phoneP.id, TODAY, "Example Lab", [{ marker: "ferritin", value: 44 }, { marker: "vitamin-d", value: 33 }], "patient")}
              onCheckIn={(m, e, s) => { patch(phoneP.id, (p) => { const d = p.days.at(-1); if (d) { d.mood = m; d.energy = e; if (s) d.symptoms = [...d.symptoms, s]; } return p; }); setToast(`${phoneP.first} checked in. The dashboard is updated.`); }} />
            <p className="mt-3 text-center text-[12px] text-[#5A6168]">Changes you make in the dashboard appear here straight away.</p>
          </aside>
        )}
      </div>

      {uploadFor !== undefined && <UploadModal patients={patients.filter((p) => p.status !== "invited")} initialPid={uploadFor ?? undefined} onClose={() => setUploadFor(undefined)} onSave={(pid, d, l, v) => saveLabs(pid, d, l, v)} />}
      <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#111518] px-4 py-2.5 text-[14px] font-medium text-white shadow-xl transition-all ${toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`} role="status">{toast}</div>
    </div>
  );
}

/* ───────────── TODAY ───────────── */
type TodayProps = { patients: Patient[]; open: (id: string) => void; remind: (p: Patient, w: string) => void; upload: (pid?: string) => void; review: (pid: string, reportId: string) => void };
function Today({ patients, open, remind, upload, review }: TodayProps) {
  const appts = patients.filter((p) => p.nextVisit?.startsWith(TODAY)).sort((a, b) => a.nextVisit!.localeCompare(b.nextVisit!));
  const reports = toReview(patients);
  const overdue = patients.flatMap((p) => p.retests.filter((r) => r.due < TODAY && r.status !== "result_in" && r.status !== "done").map((r) => ({ p, r })));
  const quiet = patients.filter((p) => p.status === "data_flowing").filter((p) => { const l = lastCheckIn(p); return l == null || l >= 4; });
  const [openReport, setOpenReport] = useState<string | null>(null);
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const chip = "rounded-full border border-white/70 bg-white/60 px-4 py-2 text-[14px] backdrop-blur-xl transition hover:bg-white";

  return (
    <div>
      <div>
        <div className="pb-4 pt-10 text-white md:pt-16">
          <div className="text-[11px] font-medium uppercase tracking-[.16em] text-white/70">{fmt(TODAY, { weekday: "long", day: "numeric", month: "long" })}{!LIVE && <> · <span style={{ color: ACCENT }}>●</span> Example data</>}</div>
          <h1 className="mt-2 text-[clamp(32px,4vw,54px)] font-light leading-[1.02] tracking-[-.03em]">Good morning,<br />{LIVE ? LIVE.me : "Dr. Vaitkienė"}.</h1>
          <p className="mt-3 max-w-md text-[15px] text-white/80">Here's what needs you today.</p>
          <div className={`${apple} bend mt-20 grid grid-cols-2 px-2 py-1 xl:grid-cols-4`}>
            {([[appts.length, "Appointments today", () => jump("t-appts")], [reports.length, "New lab results", () => jump("t-labs")], [overdue.length + quiet.length, "Follow-ups", () => jump("t-follow")], [patients.filter((p) => p.status === "data_flowing").length, "Sharing data", () => document.dispatchEvent(new CustomEvent("dg-nav", { detail: "patients" }))]] as const).map(([v, l, f], i) => (
              <button key={l} onClick={f} className={`group px-5 py-5 text-left ${i ? "xl:border-l xl:border-white/12" : ""}`}>
                <div className="text-[11px] font-medium uppercase tracking-[.14em] text-white/70">{l}</div>
                <div className="mt-2 flex items-end gap-2"><span className="text-[48px] font-light leading-none tracking-tight">{v}</span><span className="mb-2 text-white/50 transition group-hover:translate-x-1 group-hover:text-white">→</span></div>
              </button>))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end"><button onClick={() => upload()} className={btnPri}><Icon n="plus" className="h-4 w-4" />Add lab report</button></div>

      {/* 1. Appointments: what you need before each patient walks in */}
      <section id="t-appts" className="mt-12 scroll-mt-24">
        <h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/75">1 · Before today's appointments</h2>
        <p className="text-[14px] text-white/60">What changed since each patient's last visit.</p>
        <div className="mt-4">
          {appts.map((p) => {
            const since = sinceLastVisit(p);
            const ci = since.filter((d) => d.mood != null).length;
            const newLabs = reportsOf(p).filter((r) => r.date > p.lastVisit).flatMap((r) => r.values);
            const s1 = avg(since.slice(0, since.length >> 1).map((d) => d.sleepH)), s2 = avg(since.slice(since.length >> 1).map((d) => d.sleepH));
            const quote = since.filter((d) => d.note).at(-1)?.note;
            const due = p.retests.filter((r) => r.status !== "done" && r.status !== "result_in" && daysFrom(r.due) <= 31);
            return (
              <article key={p.id} className={`${apple} mb-3 grid gap-4 p-6 md:grid-cols-[110px_1fr_auto]`}>
                <div className="self-start"><div className="text-[34px] font-light tabular-nums leading-none">{p.nextVisit!.slice(11)}</div><div className="mt-1.5 text-[12px] leading-tight text-white/60">{daysFrom(p.lastVisit) * -1} days since last visit</div></div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><Avatar p={p} size={30} /><b className="text-[16px] font-semibold">{p.first} {p.last}</b><span className="text-[14px] text-white/60">{p.age} · {p.programme}</span></div>
                  {!!p.update.watching.length && <div className="mt-2 text-[13px] text-white/75">You were watching: <b className="font-semibold">{p.update.watching.join(", ")}</b></div>}
                  <ul className="mt-2 grid gap-1 text-[14px] sm:grid-cols-2">
                    <li>• Checked in {ci} of {since.length} days</li>
                    {s1 != null && s2 != null && <li>• Sleep {s1.toFixed(1)} → {s2.toFixed(1)} h</li>}
                    {newLabs.slice(0, 4).map((v) => <li key={v.marker}>• {MARKERS[v.marker].name} {v.prev ? `${v.prev.value} → ` : ""}<b className="font-semibold">{v.value}</b> {MARKERS[v.marker].unit} <RangeFlag v={v.value} marker={v.marker} /></li>)}
                    {due.map((r) => <li key={r.id}>• {r.label} {daysFrom(r.due) < 0 ? "overdue" : "due " + fmt(r.due)}</li>)}
                  </ul>
                  {quote && <p className="mt-2 text-[14px] text-white/75">“{quote}”</p>}
                </div>
                <div className="flex items-start"><button onClick={() => open(p.id)} className={btnPri}>Prepare visit →</button></div>
              </article>);
          })}
          {!appts.length && <div className="py-6 text-white/60">No appointments today.</div>}
        </div>
      </section>

      {/* 2. Lab reports waiting for review: one line each, details on demand */}
      <section id="t-labs" className="mt-12 scroll-mt-24">
        <h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/75">2 · New lab results</h2>
        <div className={`${apple} mt-4 px-5 py-1`}>
          {reports.map((r) => {
            const outside = r.values.filter((v) => v.value < MARKERS[v.marker].lo || v.value > MARKERS[v.marker].hi).length;
            const isOpen = openReport === r.id;
            return (
              <div key={r.id} className="border-t border-white/15 first:border-0">
                <div className="flex flex-wrap items-center gap-3 py-4">
                  <button onClick={() => setOpenReport(isOpen ? null : r.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-expanded={isOpen}>
                    <Avatar p={r.p} size={32} />
                    <span className="min-w-0">
                      <b className="font-semibold">{r.p.first} {r.p.last}</b>
                      <span className="block truncate text-[13px] text-white/60">{r.values.length} {r.values.length === 1 ? "value" : "values"} · {fmt(r.date)}{outside ? ` · ${outside} outside lab range` : ""} · {r.uploadedBy === "patient" ? "from patient" : "from clinic"}</span>
                    </span>
                    <span className="ml-auto text-[13px] text-white/60">{isOpen ? "Hide ▲" : "View ▼"}</span>
                  </button>
                  <button onClick={() => review(r.p.id, r.id)} className={btnSec}>Mark reviewed</button>
                </div>
                {isOpen && <div className="mb-5 ml-11 rounded-[20px] bg-white/90 p-4 text-[#111518] shadow-[inset_0_1px_0_rgba(255,255,255,.8)]"><ReportTable r={r} /><button onClick={() => open(r.p.id)} className="mt-2 text-[13px] underline underline-offset-2">Open {r.p.first}'s profile</button></div>}
              </div>);
          })}
          {!reports.length && <div className="p-4 text-white/60">All lab results are reviewed.</div>}
        </div>
      </section>

      {/* 3. Follow-ups */}
      <section id="t-follow" className="mt-12 grid scroll-mt-24 gap-4 lg:grid-cols-2">
        <div className={`${apple} p-6`}>
          <h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/75">3 · Repeat tests overdue</h2>
          <ul className="mt-2">{overdue.map(({ p, r }) => (
            <li key={r.id} className="flex items-center gap-3 border-t border-white/15 py-3.5 text-[14px] first:border-0"><button onClick={() => open(p.id)} className="flex-1 text-left"><b className="font-semibold">{p.first} {p.last}</b><span className="block text-[13px] text-white/60">{r.label} · due {fmt(r.due)} · {r.source === "guideline" ? "guideline" : "set by clinician"}{r.status === "reminded" ? " · reminded" : ""}</span></button><button onClick={() => remind(p, r.label)} className={btnSec}>Remind</button></li>))}
            {!overdue.length && <li className="text-[14px] text-white/60">Nothing overdue.</li>}
          </ul>
        </div>
        <div className={`${apple} p-6`}>
          <h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/75">Not checked in for 4+ days</h2>
          <ul className="mt-2">{quiet.map((p) => { const l = lastCheckIn(p); return (
            <li key={p.id} className="flex items-center gap-3 border-t border-white/15 py-3.5 first:border-0"><button onClick={() => open(p.id)} className="flex flex-1 items-center gap-3 text-left"><Avatar p={p} size={30} /><span><b className="font-semibold">{p.first} {p.last}</b><span className="block text-[13px] text-white/60">{l == null ? "No check-ins yet" : `Last check-in ${l} days ago`} · {p.device}, synced {p.lastSync}</span></span></button><button onClick={() => remind(p, "daily check-in")} className={btnSec}>Remind</button></li>); })}
            {!quiet.length && <li className="text-[14px] text-white/60">Everyone checked in recently.</li>}
          </ul>
          <p className="mt-2 text-[12px] text-white/60">Based on app use only.</p>
        </div>
      </section>
    </div>
  );
}

/** One visual at a time on a solid dark card, like the Daygo app: big number, one chart, one plain sentence. */
/** Clinic AI for one patient: a visit summary on demand, and questions answered
 *  from the data the patient shares with this clinic (never their private chats). */
function PatientAI({ p }: { p: Patient }) {
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setMsgs([]); setQ(""); }, [p.id]);
  const run = async (action: "ask" | "summary", question?: string) => {
    if (busy) return;
    const shown = action === "summary" ? "Summarise this patient for the next visit." : question!;
    const next = [...msgs, { role: "user" as const, content: shown }];
    setMsgs(next); setQ(""); setBusy(true);
    try {
      let answer: string;
      if (LIVE) {
        const r = await api<{ answer: string }>(action, { clinic_id: LIVE.clinicId, patient_id: p.id, question, messages: msgs });
        answer = r.answer;
      } else {
        answer = action === "summary"
          ? summarise(p).bullets.map((x) => "• " + x).join("\n") + "\n\n(Demo: in a real clinic this is written by the AI from the patient's shared data.)"
          : "In the demo this answers with example text only. Sign in with a real clinic and patient to ask about their actual data.";
      }
      setMsgs([...next, { role: "assistant", content: answer }]);
    } catch (e) {
      setMsgs([...next, { role: "assistant", content: `Couldn't answer: ${(e as Error).message}` }]);
    }
    setBusy(false);
  };
  const ideas = ["How has sleep changed this month?", "What happened around the days with symptoms?", "Is the patient following the plan?"];
  return (
    <section className={`${apple} p-6`}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/80">Ask about {p.first}</h2>
        <span className="text-[12px] text-white/50">From what {p.first} shares with your clinic</span>
        <button onClick={() => run("summary")} disabled={busy} className={`${btnPri} ml-auto disabled:opacity-50`}>Visit summary</button>
      </div>
      {msgs.length > 0 && (
        <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-white/15 px-4 py-2.5 text-[14px]" : "max-w-[92%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-black/25 px-4 py-3 text-[14px] leading-relaxed text-white/90"}>{m.content}</div>
          ))}
          {busy && <div className="w-fit rounded-2xl bg-black/25 px-4 py-2.5 text-[14px] text-white/60">Reading {p.first}'s data…</div>}
        </div>
      )}
      {msgs.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-2">{ideas.map((x) => <button key={x} onClick={() => run("ask", x)} className={pill}>{x}</button>)}</div>
      )}
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (q.trim()) run("ask", q.trim()); }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Ask about ${p.first}'s data…`} className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[14px] text-white outline-none placeholder:text-white/45 focus:border-white/50" />
        <button disabled={!q.trim() || busy} className={`${btnSec} disabled:opacity-40`}>Ask</button>
      </form>
      <p className="mt-2 text-[11px] text-white/45">Describes the data only. It doesn't diagnose or recommend treatment. Uses only what {p.first} shares with your clinic, never their private Daygo chats.</p>
    </section>
  );
}

function PatientCharts({ p }: { p: Patient }) {
  const [tab, setTab] = useState<"sleep" | "run" | "hrv">("sleep");
  const d14 = p.days.slice(-14), d30 = p.days.slice(-30);
  const lab = (d: { date: string }) => fmt(d.date);
  const sl = d14.filter((d) => d.sleepH != null);
  const longest = sl.reduce((a, b) => (b.sleepH! > a.sleepH! ? b : a), sl[0]), shortest = sl.reduce((a, b) => (b.sleepH! < a.sleepH! ? b : a), sl[0]);
  const hv = d30.map((d) => d.hrv).filter((x): x is number => x != null);
  const mean = hv.reduce((a, b) => a + b, 0) / (hv.length || 1), sd = Math.sqrt(hv.reduce((a, b) => a + (b - mean) ** 2, 0) / (hv.length || 1));
  const below = hv.filter((x) => x < mean - sd).length;
  const tabs = [["sleep", "Sleep"], ["run", "Latest run"], ["hrv", "HRV"]] as const;
  return (
    <section>
      <div className="rounded-[30px] border border-white/[.08] bg-[#0F100F]/95 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_30px_60px_-30px_rgba(0,0,0,.7)] md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full bg-white/[.06] p-1">{tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`rounded-full px-4 py-1.5 text-[13px] transition ${tab === k ? "bg-white font-medium text-[#111518]" : "text-white/70 hover:text-white"}`}>{l}</button>)}</div>
          <span className="ml-auto text-[11px] font-medium uppercase tracking-[.14em] text-white/45">{tab === "sleep" ? "Last 14 nights" : tab === "run" ? `${p.device} · example route` : "Last 30 nights"}</span>
        </div>
        <div className="mt-6">
          {tab === "sleep" && <DotColumns values={d14.map((d) => d.sleepH)} labels={d14.map(lab)} unit="h" height={220} />}
          {tab === "run" && <RouteTerrain height={330} />}
          {tab === "hrv" && <DotColumns values={d30.map((d) => d.hrv)} labels={d30.map(lab)} unit="ms" height={220} />}
        </div>
        <p className="mt-5 max-w-2xl text-[17px] leading-snug text-white">
          {tab === "sleep" && sl.length > 0 && <>Slept between {shortest.sleepH} and {longest.sleepH} hours. Longest night {fmt(longest.date)}, shortest {fmt(shortest.date)}.</>}
          {tab === "run" && <>Higher and brighter means a higher heart rate. The tallest ridge is the hardest stretch of the run.</>}
          {tab === "hrv" && <>Usually between {Math.round(mean - sd)} and {Math.round(mean + sd)} ms. {below} of {hv.length} nights were below that range.</>}
        </p>
        <p className="mt-1 text-[12px] text-white/45">{tab === "run" ? "Example route. Drag sideways to turn." : tab === "hrv" ? `The shaded band is ${p.first}'s usual range (average ± one spread). Hover to read a night.` : "Each column is one night, taller means more sleep. The band is the usual range. Hover to read a night."}</p>
      </div>
    </section>
  );
}

/* ───────────── PATIENTS ───────────── */
type Reason = { label: string; w: number; tone: "now" | "soon" | "info" };
/** Workflow reasons a patient needs the clinic's attention. Engagement and admin only, no clinical judgement. */
function reasonsOf(p: Patient): Reason[] {
  const r: Reason[] = [];
  const latestNote = p.patientNotes?.[0];
  if (latestNote && daysFrom(latestNote.at) >= -7) r.push({ label: daysFrom(latestNote.at) === 0 ? "Shared a note today" : "Shared a note", w: 45, tone: "now" });
  const unrev = reportsOf(p).filter((x) => !x.reviewed).length;
  if (unrev) r.push({ label: unrev > 1 ? `${unrev} new lab reports` : "New lab results", w: 50, tone: "now" });
  if (p.nextVisit) { const d = daysFrom(p.nextVisit); if (d === 0) r.push({ label: `Visit today ${p.nextVisit.slice(11)}`, w: 40, tone: "now" }); else if (d === 1) r.push({ label: "Visit tomorrow", w: 25, tone: "soon" }); }
  p.retests.filter((t) => t.due < TODAY && t.status !== "result_in" && t.status !== "done").forEach((t) => r.push({ label: `${t.label.replace(" retest", "")} overdue ${-daysFrom(t.due)}d`, w: 30, tone: "now" }));
  if (p.status === "data_flowing") { const l = lastCheckIn(p); if (l == null || l >= 4) r.push({ label: l == null ? "No check-ins yet" : `No check-in for ${l} days`, w: 20, tone: "soon" }); }
  if (p.status === "invited") r.push({ label: "Invited, not joined", w: 10, tone: "info" });
  if (p.status === "joined") r.push({ label: "Waiting for first data", w: 10, tone: "info" });
  if (p.status === "revoked") r.push({ label: "Stopped sharing", w: 15, tone: "info" });
  return r.sort((a, b) => b.w - a.w);
}
const toneCls = { now: "bg-[#E6E46C] text-[#111518]", soon: "border border-white/35 text-white", info: "bg-white/10 text-white/75" };

function Directory({ patients, open }: { patients: Patient[]; open: (id: string) => void }) {
  const [q, setQ] = useState(""), [prog, setProg] = useState("All"), [showOk, setShowOk] = useState(false);
  const list = patients.filter((p) => (prog === "All" || p.programme === prog) && `${p.first} ${p.last} ${p.programme}`.toLowerCase().includes(q.toLowerCase()));
  const scored = list.map((p) => ({ p, rs: reasonsOf(p) })).map((x) => ({ ...x, score: x.rs.reduce((s, r) => s + r.w, 0) }));
  const attention = scored.filter((x) => x.rs.some((r) => r.tone === "now")).sort((a, b) => b.score - a.score);
  const coming = scored.filter((x) => !attention.includes(x) && x.rs.length).sort((a, b) => b.score - a.score);
  const ok = scored.filter((x) => !attention.includes(x) && !coming.includes(x)).sort((a, b) => a.p.last.localeCompare(b.p.last));
  const row = ({ p, rs }: (typeof scored)[number]) => (
    <li key={p.id}>
      <button onClick={() => open(p.id)} className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-white/12 py-4 text-left transition hover:bg-white/[.05] md:grid-cols-[260px_1fr_150px_24px]">
        <span className="flex items-center gap-3"><Avatar p={p} size={36} /><span><b className="font-semibold">{p.first} {p.last}</b><span className="block text-[12px] text-white/55">{p.age ? `${p.age} · ` : ""}{p.programme}</span></span></span>
        <span className="hidden flex-wrap gap-1.5 md:flex">{rs.length ? rs.map((r) => <span key={r.label} className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${toneCls[r.tone]}`}>{r.label}</span>) : <span className="text-[13px] text-white/55">{oneLine(p)}</span>}</span>
        <span className="text-right text-[13px] text-white/70 md:text-left">{p.nextVisit ? <>Next visit<span className="block text-white">{fmt(p.nextVisit)} {p.nextVisit.slice(11)}</span></> : <span className="text-white/45">No visit booked</span>}</span>
        <span className="hidden text-white/50 md:block">→</span>
        {!!rs.length && <span className="col-span-3 -mt-1 flex flex-wrap gap-1.5 md:hidden">{rs.map((r) => <span key={r.label} className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${toneCls[r.tone]}`}>{r.label}</span>)}</span>}
      </button>
    </li>
  );
  return (
    <div>
      <h1 className="pt-10 text-[clamp(34px,4vw,54px)] font-light leading-[1.02] tracking-[-.03em] md:pt-16">Patients</h1>
      <p className="mt-2 text-[16px] text-white/75">{attention.length} need you now · {coming.length} coming up · {ok.length} on track</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or programme" className="w-full max-w-xs rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[14px] text-white outline-none backdrop-blur placeholder:text-white/50 focus:border-white/50" />
        {["All", ...PROGRAMMES].map((x) => <button key={x} onClick={() => setProg(x)} className={`rounded-full px-3.5 py-1.5 text-[13px] ${prog === x ? "bg-white text-[#111518]" : "border border-white/25"}`}>{x}</button>)}
      </div>

      <section className="mt-10">
        <h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/75">1 · Needs you now · {attention.length}</h2>
        <p className="mt-1 text-[13px] text-white/55">New results to review, visits today and overdue tests. Most urgent first.</p>
        <ul className="mt-3">{attention.map(row)}</ul>
        {!attention.length && <p className="py-6 text-white/60">Nothing needs you right now.</p>}
      </section>

      {!!coming.length && <section className="mt-10">
        <h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/75">2 · Coming up · {coming.length}</h2>
        <p className="mt-1 text-[13px] text-white/55">Visits tomorrow, missed check-ins and patients still setting up.</p>
        <ul className="mt-3">{coming.map(row)}</ul>
      </section>}

      <section className="mt-10">
        <button onClick={() => setShowOk(!showOk)} aria-expanded={showOk} className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.16em] text-white/75 hover:text-white">On track · {ok.length} <span>{showOk ? "▲" : "▼"}</span></button>
        {showOk && <ul className="mt-3">{ok.map(row)}</ul>}
      </section>
    </div>
  );
}

function Profile({ p, back, patch, sendToApp, remind, toast, upload, review }: {
  upload: () => void; review: (pid: string, reportId: string) => void;
  p: Patient; back: () => void; patch: (fn: (p: Patient) => Patient) => void; sendToApp: () => void; remind: (p: Patient, w: string) => void; toast: (s: string) => void;
}) {
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [marker, setMarker] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const days = useMemo(() => p.days.slice(-range), [p.days, range]);
  const sum = useMemo(() => summarise(p), [p]);
  const markers = Object.keys(MARKERS).filter((m) => p.labs.some((l) => l.marker === m));
  const since = sinceLastVisit(p);
  const blocked = p.status === "revoked";

  return (
    <div>
      <button onClick={back} className="mb-4 mt-8 text-[14px] md:mt-12 text-white/75 hover:text-white">← All patients</button>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar p={p} size={56} />
        <div>
          <h1 className="text-[clamp(32px,3.6vw,48px)] font-light leading-none tracking-[-.03em]">{p.first} {p.last}</h1>
          <div className="mt-0.5 flex flex-wrap gap-x-4 text-[14px] text-white/75"><span>{p.age} years</span><span>{p.programme}</span><span>{p.device} · synced {p.lastSync}</span><span>Last visit {fmt(p.lastVisit)}</span>{p.nextVisit && <span className="font-semibold text-white">Next visit {fmt(p.nextVisit)} {p.nextVisit.slice(11)}</span>}</div>
        </div>
      </div>
      {blocked && <div className="mt-4 rounded-2xl bg-[#F5907E]/20 p-4 text-[14px] text-[#FFD0C6]">{p.first} stopped sharing with the clinic. No new data is received.</div>}

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="grid min-w-0 content-start gap-4">
          {!!p.patientNotes?.length && (
            <section className={`${apple} p-6`}>
              <h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/80">Note from {p.first}</h2>
              <div className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-white/90">{p.patientNotes[0].text}</div>
              <div className="mt-2 text-[12px] text-white/50">Shared {fmt(p.patientNotes[0].at)}{p.patientNotes[0].ai ? " · prepared with Daygo, reviewed by " + p.first : ""}{p.patientNotes.length > 1 ? ` · ${p.patientNotes.length - 1} earlier` : ""}</div>
            </section>
          )}
          <PatientAI p={p} />
          <section className={`${apple} p-6`}>
            <div className="flex items-baseline gap-2"><h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/80">Since the last visit</h2><span className={mono}>{since.length} days · AI summary</span></div>
            <ul className="mt-3 space-y-2 text-[15px] leading-snug">{sum.bullets.map((b, i) => <li key={i} className="flex gap-2.5"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#E6E46C]" />{b}</li>)}</ul>
            {!!sum.quotes.length && <div className="mt-4"><div className={mono}>In {p.first}'s words</div>{sum.quotes.map((q) => <blockquote key={q.date} className="mt-2 border-l-2 border-[#E6E46C] pl-3 text-[15px]">“{q.text}” <span className="text-[12px] text-white/60">{fmt(q.date)}</span></blockquote>)}</div>}
            {!!sum.missing.length && <div className="mt-4 rounded-xl bg-white/[.06] p-3 text-[14px]"><b className="font-semibold">Missing or follow-up:</b> {sum.missing.join(" · ")}</div>}
            <p className="mt-3 text-[12px] text-white/60">A factual description of what {p.first} shared. It is not a diagnosis or a risk assessment.</p>
          </section>

          <section className={`${apple} p-6`}>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/80">The whole picture</h2>
              <span className="text-[13px] text-white/60">Wearables and how {p.first} feels, day by day</span>
              <div className="ml-auto flex rounded-full bg-white/10 p-0.5">{([7, 30, 90] as const).map((r) => <button key={r} onClick={() => setRange(r)} className={`rounded-full px-3 py-1 text-[13px] ${range === r ? "bg-white font-semibold text-[#111518] shadow-sm" : "text-white/75"}`}>{r} days</button>)}</div>
            </div>
            <div className="mt-4"><WholePicture days={days} /></div>
            <p className="mt-2 text-[12px] text-white/60">Hover a day to see all values. Darker squares mean higher mood or energy.</p>
          </section>

          <PatientCharts p={p} />

          <section className={`${apple} p-6`}>
            <div className="flex flex-wrap items-center gap-2"><h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/80">Lab results</h2><button onClick={upload} className={`${btnSec} ml-auto`}>+ Add lab report</button></div>
            {!p.sharing.tests ? <p className="mt-2 text-white/60">{p.first} is not sharing test results.</p> : !markers.length ? <p className="mt-2 text-white/60">No results yet.</p> : (
              <div className="mt-3 space-y-4">
                {reportsOf(p).slice(0, showAll ? 99 : 2).map((r) => (
                  <div key={r.id} className={`rounded-2xl p-4 ${r.reviewed ? "bg-white/[.04]" : "bg-white/[.08] ring-1 ring-[#E6E46C]/70"}`}>
                    <div className="flex flex-wrap items-center gap-2"><b className="font-semibold">Report {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</b><span className="text-[13px] text-white/60">{r.lab} · {r.uploadedBy === "patient" ? `uploaded by ${p.first}` : "added by clinic"}</span>
                      {r.reviewed ? <span className="ml-auto text-[12px] text-white/60">Reviewed</span> : <button onClick={() => review(p.id, r.id)} className={`${btnPri} ml-auto`}>Mark reviewed</button>}</div>
                    <div className="mt-2 overflow-x-auto"><ReportTable r={r} dark /></div>
                  </div>))}
                {reportsOf(p).length > 2 && <button onClick={() => setShowAll(!showAll)} className="text-[13px] underline underline-offset-2">{showAll ? "Show fewer reports" : `Show all ${reportsOf(p).length} reports`}</button>}
                <div>
                  <div className="mb-2 text-[13px] font-semibold">Trend by marker</div>
                  <div className="flex flex-wrap gap-2">{markers.map((m) => <button key={m} onClick={() => setMarker(marker === m ? null : m)} className={marker === m ? pillOn : pill}>{MARKERS[m].name}</button>)}</div>
                  {marker && <div className="mt-3 rounded-2xl bg-white/[.05] p-4"><LabHistory points={p.labs.filter((l) => l.marker === marker).sort((a, b) => a.date.localeCompare(b.date))} lo={MARKERS[marker].lo} hi={MARKERS[marker].hi} unit={MARKERS[marker].unit} /></div>}
                </div>
                <p className="text-[12px] text-white/60">Values and ranges as printed on the lab report. L and H are the lab's own markings.</p>
              </div>
            )}
          </section>

          <section className={`${apple} p-6`}>
            <h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/80">Repeat tests and screenings</h2>
            <ul className="mt-2 divide-y divide-white/10">{p.retests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1"><b className="font-semibold">{r.label}</b><div className="text-[12px] text-white/60">{r.source === "guideline" ? `Guideline: ${r.sourceDetail}` : `Set by ${r.sourceDetail}`}</div></div>
                <RetestStatus r={r} />
                {r.status === "result_in" ? <button className={btnSec} onClick={() => { patch((x) => { x.retests = x.retests.map((y) => (y.id === r.id ? { ...y, status: "done" } : y)); return x; }); toast("Marked as reviewed"); }}>Mark reviewed</button>
                  : <button className={btnSec} onClick={() => { remind(p, r.label); patch((x) => { x.retests = x.retests.map((y) => (y.id === r.id ? { ...y, status: "reminded" } : y)); return x; }); }}>Remind</button>}
              </li>))}
              {!p.retests.length && <li className="py-3 text-white/60">None scheduled.</li>}
            </ul>
          </section>
        </div>

        <AdjustPanel p={p} patch={patch} sendToApp={sendToApp} toast={toast} disabled={blocked} />
      </div>
    </div>
  );
}

function MetricsGlass({ days, p }: { days: Patient["days"]; p: Patient }) {
  const [m, setM] = useState<"sleepH" | "hrv" | "eveningHrv" | "rhr">("hrv");
  const last7 = p.days.slice(-7);
  const meta = { sleepH: ["Sleep", "h", 1, "sleep"], hrv: ["HRV overnight", "ms", 0, "hrv"], eveningHrv: ["HRV 16–17h", "ms", 0, "energy"], rhr: ["Resting heart rate", "bpm", 0, "rhr"] } as const;
  const [title, unit, dec, k] = meta[m];
  if (!last7.length) return null;
  const half = (key: keyof typeof meta) => [avg(days.slice(0, Math.floor(days.length / 2)).map((d) => d[key])), avg(days.slice(Math.floor(days.length / 2)).map((d) => d[key]))] as const;
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">{(Object.keys(meta) as (keyof typeof meta)[]).map((x) => <button key={x} onClick={() => setM(x)} className={m === x ? pillOn : pill}>{meta[x][0]}</button>)}</div>
      <AuraCurve key={m} title={`${title} · last 7 days`} k={k} values={last7.map((d) => d[m])} unit={unit} dec={dec}
        labels={last7.map((d) => fmt(d.date, { weekday: "long", day: "numeric", month: "short" }))}
        dayLetters={last7.map((d) => new Date(d.date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "narrow" }))} />
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {([["sleepH", "Sleep", "h", 1, "sleep"], ["hrv", "HRV", "ms", 0, "hrv"], ["rhr", "Resting HR", "bpm", 0, "rhr"], ["steps", "Steps", "/day", 0, "steps"]] as const).map(([key, l, u, d, a]) => {
          const [h1, h2] = key === "steps" ? [avg(days.slice(0, Math.floor(days.length / 2)).map((x) => x.steps)), avg(days.slice(Math.floor(days.length / 2)).map((x) => x.steps))] : half(key);
          const v = avg(days.map((x) => x[key]));
          return <AuraPill key={key} k={a} label={`${l} · ${days.length}d avg`} value={v == null ? "––" : key === "steps" ? (v / 1000).toFixed(1) + "k" : v.toFixed(d)} unit={key === "steps" ? "" : u} change={changePill(h1, h2)} spark={days.map((x) => x[key])} />;
        })}
      </div>
      <p className="text-[12px] text-[#5A6168]">Change compares the first and second half of the selected period. It shows direction only, not whether it is good or bad.</p>
    </section>
  );
}

function RetestStatus({ r }: { r: Retest }) {
  const d = daysFrom(r.due);
  if (r.status === "result_in") return <span className="rounded-full border border-current px-2.5 py-1 text-[12px] opacity-90">Result in</span>;
  if (r.status === "done") return <span className="rounded-full border border-current/40 px-2.5 py-1 text-[12px] opacity-70">Reviewed</span>;
  if (d < 0) return <span className="rounded-full bg-[#F5907E]/25 px-2.5 py-1 text-[12px] font-medium">Overdue {-d} days{r.status === "reminded" ? " · reminded" : ""}</span>;
  return <span className="rounded-full border border-current/40 px-2.5 py-1 text-[12px] opacity-70">Due {fmt(r.due)}{r.status === "reminded" ? " · reminded" : ""}</span>;
}

/* ───────────── ADJUST PANEL ───────────── */
function AdjustPanel({ p, patch, sendToApp, toast, disabled }: { p: Patient; patch: (fn: (p: Patient) => Patient) => void; sendToApp: () => void; toast: (s: string) => void; disabled: boolean }) {
  const [watching, setWatching] = useState<string[]>(p.update.watching);
  const [custom, setCustom] = useState("");
  const [plan, setPlan] = useState("");
  const [note, setNote] = useState("");
  const [rtMarker, setRtMarker] = useState("ferritin");
  const [rtDate, setRtDate] = useState(addDays(TODAY, 90));
  useEffect(() => setWatching(p.update.watching), [p.id, p.update.watching]);
  const toggle = (w: string) => setWatching((ws) => (ws.includes(w) ? ws.filter((x) => x !== w) : [...ws, w]));
  const dirty = JSON.stringify(watching) !== JSON.stringify(p.update.watching) || plan.trim() || note.trim();

  const send = () => {
    patch((x) => {
      x.update.watching = watching;
      if (plan.trim()) x.update.plan = [{ id: uid(), text: plan.trim(), at: TODAY }, ...x.update.plan];
      if (note.trim()) x.update.notes = [{ id: uid(), text: note.trim(), at: TODAY, by: CLINICIAN }, ...x.update.notes];
      return x;
    });
    if (LIVE) {
      const base = { clinic_id: LIVE.clinicId, patient_id: p.id };
      const calls: Promise<unknown>[] = [];
      if (JSON.stringify(watching) !== JSON.stringify(p.update.watching)) calls.push(api("update", { ...base, kind: "watching", watching }));
      if (plan.trim()) calls.push(api("update", { ...base, kind: "plan", text: plan.trim() }));
      if (note.trim()) calls.push(api("update", { ...base, kind: "note", text: note.trim() }));
      Promise.all(calls).catch((e) => toast(`Not saved: ${e.message}`));
    }
    setPlan(""); setNote(""); sendToApp(); toast(`Sent to ${p.first}'s Daygo app`);
  };
  const addRetest = () => {
    patch((x) => { x.retests = [...x.retests, { id: uid(), marker: rtMarker, label: `${MARKERS[rtMarker].name} retest`, due: rtDate, source: "clinician", sourceDetail: CLINICIAN, status: "scheduled" }]; return x; });
    if (LIVE) api("update", { clinic_id: LIVE.clinicId, patient_id: p.id, kind: "retest", marker: rtMarker, due: rtDate, label: `${MARKERS[rtMarker].name} retest` }).catch((e) => toast(`Not saved: ${e.message}`));
    toast(`${MARKERS[rtMarker].name} retest set for ${fmt(rtDate)}`);
  };
  const field = "w-full rounded-xl bg-white px-3 py-2 text-[14px] outline-none ring-1 ring-[#111518]/12 focus:ring-[#111518]/40";

  return (
    <aside style={{ background: GRAD.night }} className={`h-fit space-y-5 rounded-[28px] p-6 text-white shadow-[0_30px_60px_-30px_rgba(30,50,80,.6)] xl:sticky xl:top-3 ${disabled ? "pointer-events-none opacity-50" : ""}`}>
      <div><h2 className="text-[17px] font-semibold">Adjust care</h2><p className="text-[13px] text-white/60">Your decisions go to {p.first}'s app.</p></div>
      <div>
        <div className="text-[13px] font-semibold">What I'm watching</div>
        <div className="mt-2 flex flex-wrap gap-1.5">{[...new Set([...WATCH_OPTIONS, ...watching])].map((w) => <button key={w} onClick={() => toggle(w)} className={`rounded-full px-3 py-1 text-[13px] transition ${watching.includes(w) ? "bg-[#D4FF4A] font-semibold text-[#161913]" : "bg-white/10 text-white/80 hover:bg-white/15"}`}>{w}</button>)}</div>
        <div className="mt-2 flex gap-2"><input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Add your own" className={`${field} bg-white/10 text-white ring-white/10 placeholder:text-white/40`} onKeyDown={(e) => { if (e.key === "Enter" && custom.trim()) { toggle(custom.trim()); setCustom(""); } }} /></div>
      </div>
      <div><label className="text-[13px] font-semibold" htmlFor="plan">Plan change</label><textarea id="plan" value={plan} onChange={(e) => setPlan(e.target.value)} rows={2} placeholder="e.g. Take a 10 minute break at 16:00 on workdays" className={`${field} mt-2 bg-white/10 text-white ring-white/10 placeholder:text-white/40`} /></div>
      <div><label className="text-[13px] font-semibold" htmlFor="note">Note to {p.first}</label><textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Short and personal" className={`${field} mt-2 bg-white/10 text-white ring-white/10 placeholder:text-white/40`} /></div>
      <button disabled={!dirty} onClick={send} className="w-full rounded-full bg-[#D4FF4A] py-2.5 text-[14px] font-semibold text-[#161913] transition hover:brightness-105 active:scale-[.98] disabled:opacity-40">Send to patient app</button>
      <div className="border-t border-white/10 pt-4">
        <div className="text-[13px] font-semibold">Set a retest</div>
        <div className="mt-2 flex gap-2">
          <select value={rtMarker} onChange={(e) => setRtMarker(e.target.value)} className={`${field} bg-white/10 text-white ring-white/10`}>{Object.entries(MARKERS).map(([k, m]) => <option key={k} value={k} className="text-black">{m.name}</option>)}</select>
          <input type="date" value={rtDate} min={TODAY} onChange={(e) => setRtDate(e.target.value)} className={`${field} w-[150px] bg-white/10 text-white ring-white/10 [color-scheme:dark]`} />
        </div>
        <button onClick={addRetest} className="mt-2 w-full rounded-full py-2 text-[14px] font-semibold ring-1 ring-white/25 hover:bg-white/10">Add retest</button>
      </div>
    </aside>
  );
}

/* ───────────── TESTS ───────────── */
function Tests({ patients, open, remind, patch }: { patients: Patient[]; open: (id: string) => void; remind: (p: Patient, w: string) => void; patch: (id: string, fn: (p: Patient) => Patient) => void }) {
  const [src, setSrc] = useState<"all" | "clinician" | "guideline">("all");
  const [showLater, setShowLater] = useState(false);
  const all = patients.flatMap((p) => p.retests.filter((r) => r.status !== "done" && (src === "all" || r.source === src)).map((r) => ({ p, r })));
  const results = all.filter(({ r }) => r.status === "result_in");
  const overdue = all.filter(({ r }) => r.status !== "result_in" && r.due < TODAY).sort((a, b) => a.r.due.localeCompare(b.r.due));
  const soon = all.filter(({ r }) => r.status !== "result_in" && r.due >= TODAY && daysFrom(r.due) <= 30).sort((a, b) => a.r.due.localeCompare(b.r.due));
  const later = all.filter(({ r }) => r.status !== "result_in" && daysFrom(r.due) > 30).sort((a, b) => a.r.due.localeCompare(b.r.due));
  const doRemind = (items: typeof all) => { items.forEach(({ p, r }) => patch(p.id, (x) => { x.retests = x.retests.map((y) => (y.id === r.id ? { ...y, status: "reminded" } : y)); return x; })); remind({ first: items.length === 1 ? items[0].p.first : `${items.length} patients` } as Patient, items.length === 1 ? items[0].r.label : "repeat tests"); };
  const when = (r: Retest) => { const d = daysFrom(r.due); return d < 0 ? `${-d} days overdue` : d === 0 ? "Due today" : `Due ${fmt(r.due)} · in ${d} days`; };
  const rows = (items: typeof all, action: "review" | "remind") => (
    <ul className="mt-2">{items.map(({ p, r }) => (
      <li key={r.id} className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-white/12 py-3.5 md:grid-cols-[260px_1fr_200px_auto]">
        <button onClick={() => open(p.id)} className="flex items-center gap-3 text-left"><Avatar p={p} size={32} /><b className="font-semibold">{p.first} {p.last}</b></button>
        <span className="hidden md:block">{r.label}<span className="block text-[12px] text-white/55" title={r.sourceDetail}>{r.source === "guideline" ? "Guideline screening" : `Set by ${r.sourceDetail}`}</span></span>
        <span className="hidden text-[13px] md:block">{action === "review" ? "Result received" : when(r)}{r.status === "reminded" && <span className="block text-[12px] text-white/55">Reminder sent</span>}</span>
        {action === "review" ? <button onClick={() => open(p.id)} className={btnPri}>Review</button> : <button onClick={() => doRemind([{ p, r }])} className={btnSec}>Remind</button>}
        <span className="col-span-2 -mt-2 text-[12px] text-white/60 md:hidden">{r.label} · {action === "review" ? "result received" : when(r)}</span>
      </li>))}</ul>
  );
  const head = (title: string, n: number, note: string, items?: typeof all) => (
    <div className="flex flex-wrap items-end gap-3"><div><h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/75">{title} · {n}</h2><p className="mt-1 text-[13px] text-white/55">{note}</p></div>
      {items && items.length > 1 && <button onClick={() => doRemind(items)} className={`${btnSec} ml-auto`}>Remind all {items.length}</button>}</div>
  );
  return (
    <div>
      <h1 className="pt-10 text-[clamp(34px,4vw,54px)] font-light leading-[1.02] tracking-[-.03em] md:pt-16">Tests</h1>
      <p className="mt-2 text-[16px] text-white/75">{results.length} to review · {overdue.length} overdue · {soon.length} due in the next 30 days</p>
      <div className="mt-5"><select value={src} onChange={(e) => setSrc(e.target.value as typeof src)} className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[13px] text-white"><option className="text-black" value="all">All sources</option><option className="text-black" value="clinician">Set by clinician</option><option className="text-black" value="guideline">Guideline screenings</option></select></div>

      <section className="mt-10">{head("1 · Results to review", results.length, "The result is in. Look at it and close the loop.")}{results.length ? rows(results, "review") : <p className="py-4 text-white/60">Nothing to review.</p>}</section>
      <section className="mt-10">{head("2 · Overdue", overdue.length, "Longest overdue first.", overdue.filter((x) => x.r.status !== "reminded"))}{overdue.length ? rows(overdue, "remind") : <p className="py-4 text-white/60">Nothing overdue.</p>}</section>
      <section className="mt-10">{head("3 · Due in the next 30 days", soon.length, "Remind patients so they can book in time.", soon.filter((x) => x.r.status !== "reminded"))}{soon.length ? rows(soon, "remind") : <p className="py-4 text-white/60">Nothing due soon.</p>}</section>
      <section className="mt-10">
        <button onClick={() => setShowLater(!showLater)} aria-expanded={showLater} className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.16em] text-white/75 hover:text-white">Later · {later.length} <span>{showLater ? "▲" : "▼"}</span></button>
        {showLater && rows(later, "remind")}
      </section>
      <p className="mt-8 text-[12px] text-white/55">Guideline schedules are listed with their source and must be confirmed by a clinician. Daygo does not decide which tests a patient needs.</p>
    </div>
  );
}

/* ───────────── ADD PATIENT ───────────── */
/** Real, scannable QR. Opens the Daygo app on the join screen with the code filled in. */
function QR({ seed }: { seed: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    QRCode.toString(joinURL(seed), { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#111518", light: "#ffffff" } })
      .then(setSvg).catch(() => setSvg(""));
  }, [seed]);
  return <div className="h-[190px] w-[190px] rounded-2xl bg-white p-2 [&>svg]:h-full [&>svg]:w-full" aria-label={`QR code to join with ${seed}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}

/** Universal link: opens Daygo directly if installed, else the daygo.ai join page. */
const joinURL = (code: string) => `https://daygo.ai/join/${encodeURIComponent(code)}`;

function AddPatient({ onAdd, patients, open }: { onAdd: (p: Patient) => void; patients: Patient[]; open: (id: string) => void }) {
  const [first, setFirst] = useState(""), [last, setLast] = useState(""), [prog, setProg] = useState(PROGRAMMES[0]);
  const [share, setShare] = useState({ wearables: true, checkins: true, tests: true });
  const [made, setMade] = useState<string | null>(null);
  const pending = patients.filter((p) => p.status === "invited" || p.status === "joined");
  const create = async () => {
    if (LIVE) {
      try {
        const r = await api<{ code: string }>("create_invite", { clinic_id: LIVE.clinicId, label: `${first.trim()} ${last.trim()}`.trim(), programme: prog, scopes: share });
        setMade(r.code);
      } catch (e) { alert((e as Error).message); }
      return;
    }
    const id = "p" + uid();
    const code = "DG-" + id.slice(1, 5).toUpperCase();
    onAdd({ ...DEMO_PATIENTS[10], id, first: first.trim(), last: last.trim(), programme: prog, status: "invited", sharing: { wearables: false, checkins: false, tests: false }, days: [], labs: [], retests: [], update: { watching: [], plan: [], notes: [] }, nextVisit: null, lastVisit: TODAY, enrolled: TODAY, lastSync: "Not connected", device: "Not connected", age: 0, color: "#5A6168" });
    setMade(code);
  };
  const field = "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-[15px] text-white outline-none backdrop-blur focus:border-white/50";
  return (
    <div>
      <h1 className="pt-10 text-[clamp(34px,4vw,54px)] font-light leading-[1.02] tracking-[-.03em] md:pt-16">Add patient</h1>
      <p className="mt-1 text-[16px] text-white/75">Send a link. The patient joins in under a minute.</p>
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <section>
          {!made ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-[13px] font-medium">First name<input value={first} onChange={(e) => setFirst(e.target.value)} className={`${field} mt-1`} /></label>
                <label className="text-[13px] font-medium">Last name<input value={last} onChange={(e) => setLast(e.target.value)} className={`${field} mt-1`} /></label>
              </div>
              <label className="mt-3 block text-[13px] font-medium">Programme<select value={prog} onChange={(e) => setProg(e.target.value)} className={`${field} mt-1`}>{PROGRAMMES.map((x) => <option key={x} className="text-black">{x}</option>)}</select></label>
              <div className="mt-4 text-[13px] font-medium">Ask to share</div>
              <p className="text-[12px] text-white/60">The patient sees this list and decides. They can change it any time.</p>
              {([["wearables", "Wearables: sleep, HRV, heart rate, steps"], ["checkins", "Check-ins: mood, energy, symptoms, food"], ["tests", "Blood test results"]] as const).map(([k, l]) => (
                <label key={k} className="mt-2 flex items-center gap-3 text-[14px]"><input type="checkbox" checked={share[k]} onChange={(e) => setShare({ ...share, [k]: e.target.checked })} className="h-4 w-4 accent-[#E6E46C]" />{l}</label>
              ))}
              <button disabled={!first.trim() || !last.trim()} onClick={create} className={`${btnPri} mt-5 disabled:opacity-40`}>Create invite</button>
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-6">
              <QR seed={made} />
              <div>
                <div className={mono}>Invite for {first} {last}</div>
                <div className="mt-1 font-mono text-[26px] font-semibold tracking-[.12em]">{made}</div>
                <div className="mt-1 text-[13px] text-white/60">Scan with the iPhone camera, or type the code in Daygo → Settings → My clinic · valid 14 days</div>
                <div className="mt-4 flex gap-2"><button onClick={() => { navigator.clipboard?.writeText(made); }} className={btnSec}>Copy code</button><button onClick={() => { setMade(null); setFirst(""); setLast(""); }} className={btnSec}>Invite another</button></div>
                
              </div>
            </div>
          )}
        </section>
        <section>
          <h2 className="text-[12px] font-semibold uppercase tracking-[.16em] text-white/75">What the patient does</h2>
          <ol className="mt-3 space-y-3">{["Opens the link or scans the code", "Signs in with Apple or Google", "Chooses what to share with your clinic", "Allows Apple Health once. Done."].map((t, i) => (
            <li key={t} className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/30 text-[13px] font-semibold text-white">{i + 1}</span><span className="text-[15px]">{t}</span></li>))}</ol>
          <div className="mt-5 border-t border-white/15 pt-4">
            <div className="text-[14px] font-semibold">Waiting to connect</div>
            <ul className="mt-2">{pending.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-1.5 text-[14px]"><button onClick={() => open(p.id)} className="flex-1 text-left"><b className="font-semibold">{p.first} {p.last}</b> · {p.programme}</button><span className="rounded-full bg-white/10 px-2.5 py-1 text-[12px]">{p.status === "invited" ? "Invited" : "Joined, waiting for data"}</span></li>))}
              {!pending.length && <li className="text-[14px] text-white/60">Nobody waiting.</li>}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
