"use client";

// Clinic v2 views: team, inbox, settings, audit log, visit history, export,
// session timeout and Lithuanian. All talk to clinic-api; nothing here
// reads patient data the server hasn't already checked consent for.
import { useEffect, useRef, useState } from "react";
import { api, sb } from "./live";
import { liquid as apple } from "./glass";
import { MARKERS, Patient } from "./data";
import { avg, summarise } from "./summary";

export const btnPri = "inline-flex items-center gap-2 rounded-full bg-[#E6E46C] px-5 py-2.5 text-[14px] font-semibold text-[#111518] shadow-[0_10px_24px_-10px_rgba(0,0,0,.5)] transition hover:brightness-105 active:scale-[.98] disabled:opacity-40";
export const btnSec = "inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[.14] px-3.5 py-1.5 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.3)] backdrop-blur-xl transition hover:bg-white/25 active:scale-[.98] disabled:opacity-40";
const field = "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-[14px] text-white outline-none placeholder:text-white/40 focus:border-white/50";
const h1 = "pt-10 text-[clamp(34px,4vw,54px)] font-light leading-[1.02] tracking-[-.03em] md:pt-16";
const h2 = "text-[12px] font-semibold uppercase tracking-[.16em] text-white/75";

/* ───────────── LANGUAGE ───────────── */

export type Lang = "en" | "lt";
const LT: Record<string, string> = {
  "Today": "Šiandien", "Patients": "Pacientai", "Tests": "Tyrimai", "Add patient": "Pridėti pacientą",
  "Inbox": "Pranešimai", "Team": "Komanda", "Settings": "Nustatymai", "Audit log": "Veiksmų žurnalas", "Patient view": "Paciento vaizdas",
  "Sign out": "Atsijungti", "Good morning,": "Labas rytas,", "Here's what needs you today.": "Štai kam šiandien reikia jūsų dėmesio.",
  "Appointments today": "Šiandienos vizitai", "New lab results": "Nauji tyrimų rezultatai", "Follow-ups": "Sekti", "Sharing data": "Dalijasi duomenimis",
  "Add lab report": "Pridėti tyrimų ataskaitą", "Remind": "Priminti", "Mark reviewed": "Pažymėti peržiūrėtu",
  "All patients": "Visi pacientai", "Search by name or programme": "Ieškoti pagal vardą ar programą",
  "Visit summary": "Vizito santrauka", "Adjust care": "Koreguoti priežiūrą", "Send to patient app": "Siųsti į paciento programėlę",
  "Visits": "Vizitai", "Log a visit": "Įrašyti vizitą", "Export": "Eksportuoti", "Archive patient": "Archyvuoti pacientą", "Restore patient": "Grąžinti pacientą",
  "Show archived": "Rodyti archyvuotus", "Sort": "Rikiuoti", "Most urgent": "Svarbiausi", "Name": "Vardas", "Next visit": "Kitas vizitas",
  "Sign in to your clinic": "Prisijunkite prie savo klinikos", "Work email": "Darbo el. paštas", "Email me a sign-in link": "Atsiųsti prisijungimo nuorodą",
  "Continue with Google": "Tęsti su Google", "Language": "Kalba", "Save": "Išsaugoti", "Saved": "Išsaugota",
  "Clinic name": "Klinikos pavadinimas", "Your name, as patients see it": "Jūsų vardas, kaip jį mato pacientai",
  "Sign out after inactivity": "Atsijungti po neveiklumo", "minutes": "min.", "Invite colleague": "Pakviesti kolegą",
  "Role": "Rolė", "Clinician": "Gydytojas", "Admin": "Administratorius", "Remove": "Pašalinti", "Pending invites": "Laukiantys kvietimai",
  "Nothing new.": "Nieko naujo.", "Mark all read": "Pažymėti kaip skaitytus", "When": "Kada", "Who": "Kas", "What": "Kas atlikta", "Patient": "Pacientas",
  "You were signed out after inactivity.": "Buvote atjungti dėl neveiklumo.",
};
let LANG: Lang = "en";
export function setLang(l: Lang) { LANG = l; try { localStorage.setItem("dgc_lang", l); } catch {} }
export function initLang(): Lang { try { const l = localStorage.getItem("dgc_lang"); if (l === "lt" || l === "en") LANG = l; } catch {} return LANG; }
export const t = (s: string) => (LANG === "lt" ? LT[s] ?? s : s);

/* ───────────── SESSION TIMEOUT ───────────── */

/** Signs out after `minutes` without mouse/keyboard/touch activity (shared clinic computers). */
export function useIdleSignOut(enabled: boolean, minutes: number) {
  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try { sessionStorage.setItem("dgc_timeout", "1"); } catch {}
        await sb().auth.signOut();
        location.reload();
      }, minutes * 60_000);
    };
    const evs = ["mousemove", "keydown", "pointerdown", "scroll", "touchstart"] as const;
    evs.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => { clearTimeout(timer); evs.forEach((e) => window.removeEventListener(e, reset)); };
  }, [enabled, minutes]);
}

/* ───────────── INBOX ───────────── */

type InboxItem = { kind: string; at: string; patient_id: string | null; who: string | null; detail?: string };
const KIND_TEXT: Record<string, (i: InboxItem) => string> = {
  patient_joined: (i) => `${i.who} joined your clinic`,
  patient_shared_note: (i) => `${i.who} shared a note before their visit`,
  patient_revoked: (i) => `${i.who} stopped sharing with the clinic`,
  patient_changed_scopes: (i) => `${i.who} changed what they share`,
  member_joined: () => "A colleague joined the clinic",
  retest_overdue: (i) => `${i.who}: ${i.detail ?? "retest"} is overdue`,
};

/** Unread count for the nav badge; refreshes every 2 minutes. */
export function useInboxCount(clinicId: string | null) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!clinicId) return;
    const load = () => api<{ items: InboxItem[]; seen_at: string | null }>("inbox", { clinic_id: clinicId })
      .then((r) => setN(r.items.filter((i) => i.kind !== "retest_overdue" && (!r.seen_at || i.at > r.seen_at)).length)).catch(() => {});
    load();
    const t = setInterval(load, 120_000);
    const f = () => load();
    document.addEventListener("dgc-inbox-seen", f);
    return () => { clearInterval(t); document.removeEventListener("dgc-inbox-seen", f); };
  }, [clinicId]);
  return n;
}

export function InboxView({ clinicId, open }: { clinicId: string; open: (id: string) => void }) {
  const [items, setItems] = useState<InboxItem[] | null>(null);
  const [seen, setSeen] = useState<string | null>(null);
  useEffect(() => {
    api<{ items: InboxItem[]; seen_at: string | null }>("inbox", { clinic_id: clinicId }).then((r) => { setItems(r.items); setSeen(r.seen_at); }).catch(() => setItems([]));
  }, [clinicId]);
  const markRead = async () => { await api("inbox_seen", { clinic_id: clinicId }).catch(() => {}); setSeen(new Date().toISOString()); document.dispatchEvent(new Event("dgc-inbox-seen")); };
  return (
    <div>
      <h1 className={h1}>{t("Inbox")}</h1>
      <p className="mt-2 text-[16px] text-white/75">What patients did in the last 14 days, and tests that are overdue.</p>
      <div className="mt-4"><button onClick={markRead} className={btnSec}>{t("Mark all read")}</button></div>
      <div className={`${apple} mt-6 px-5 py-1`}>
        {items === null && <p className="p-4 text-white/60">Loading…</p>}
        {items?.length === 0 && <p className="p-4 text-white/60">{t("Nothing new.")}</p>}
        {items?.map((i, k) => {
          const unread = i.kind !== "retest_overdue" && (!seen || i.at > seen);
          return (
            <button key={k} onClick={() => i.patient_id && open(i.patient_id)} className="flex w-full items-center gap-3 border-t border-white/12 py-3.5 text-left first:border-0">
              <span className={`h-2 w-2 shrink-0 rounded-full ${unread ? "bg-[#E6E46C]" : "bg-transparent"}`} />
              <span className="flex-1 text-[14.5px]">{(KIND_TEXT[i.kind] ?? ((x) => `${x.who ?? ""} ${x.kind}`))(i)}</span>
              <span className="text-[12px] text-white/55">{new Date(i.at).toLocaleDateString(LANG === "lt" ? "lt-LT" : "en-GB", { day: "numeric", month: "short" })}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[12px] text-white/50">Email alerts are not set up yet; this inbox and the badge in the menu show new activity.</p>
    </div>
  );
}

/* ───────────── TEAM ───────────── */

type Member = { user_id: string; role: string; display_name: string | null; email: string | null; me: boolean };
type MInvite = { code: string; email: string; role: string; expires_at: string };

export function TeamView({ clinicId, toast }: { clinicId: string; toast: (s: string) => void }) {
  const [data, setData] = useState<{ members: Member[]; invites: MInvite[]; my_role: string } | null>(null);
  const [email, setEmail] = useState(""), [role, setRole] = useState("clinician");
  const load = () => api<{ members: Member[]; invites: MInvite[]; my_role: string }>("members", { clinic_id: clinicId }).then(setData).catch((e) => toast(e.message));
  useEffect(() => { load(); }, [clinicId]); // eslint-disable-line react-hooks/exhaustive-deps
  const admin = data?.my_role === "admin";
  const act = async (action: string, body: Record<string, unknown>, ok: string) => {
    try { await api(action, { clinic_id: clinicId, ...body }); toast(ok); load(); } catch (e) { toast((e as Error).message); }
  };
  return (
    <div>
      <h1 className={h1}>{t("Team")}</h1>
      <p className="mt-2 text-[16px] text-white/75">Everyone here sees the same patients. Admins can invite and remove colleagues and change clinic settings.</p>
      <div className={`${apple} mt-8 px-5 py-1`}>
        {data?.members.map((m) => (
          <div key={m.user_id} className="flex flex-wrap items-center gap-3 border-t border-white/12 py-4 first:border-0">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-[12px] font-semibold">{(m.display_name ?? m.email ?? "?").split(/\s+/).map((w) => w[0]).join("").slice(0, 2)}</span>
            <span className="min-w-0 flex-1"><b className="font-semibold">{m.display_name ?? "No name yet"}{m.me ? " (you)" : ""}</b><span className="block text-[13px] text-white/60">{m.email}</span></span>
            {admin && !m.me ? (
              <>
                <select value={m.role} onChange={(e) => act("set_member_role", { user_id: m.user_id, role: e.target.value }, "Role updated")} className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[13px] text-white">
                  <option className="text-black" value="clinician">{t("Clinician")}</option><option className="text-black" value="admin">{t("Admin")}</option>
                </select>
                <button onClick={() => confirm(`Remove ${m.display_name ?? m.email}? They lose access to all patients.`) && act("remove_member", { user_id: m.user_id }, "Removed")} className={btnSec}>{t("Remove")}</button>
              </>
            ) : <span className="rounded-full bg-white/10 px-3 py-1 text-[12px]">{m.role === "admin" ? t("Admin") : t("Clinician")}</span>}
          </div>
        ))}
      </div>

      {admin && (
        <section className={`${apple} mt-6 p-6`}>
          <h2 className={h2}>{t("Invite colleague")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="colleague@clinic.lt" type="email" className={`${field} max-w-xs`} />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-xl border border-white/20 bg-white/10 px-3 text-[14px] text-white">
              <option className="text-black" value="clinician">{t("Clinician")}</option><option className="text-black" value="admin">{t("Admin")}</option>
            </select>
            <button disabled={!email.includes("@")} onClick={async () => { await act("invite_member", { email, role }, `Invited ${email}`); setEmail(""); }} className={btnPri}>{t("Invite colleague")}</button>
          </div>
          <p className="mt-3 text-[13px] text-white/60">Send them <b className="text-white">daygo.ai/clinic</b> and ask them to sign in with exactly this email. They join automatically. Invites last 14 days.</p>
          {!!data?.invites.length && (
            <div className="mt-5">
              <div className="text-[13px] font-semibold">{t("Pending invites")}</div>
              {data.invites.map((i) => (
                <div key={i.code} className="mt-2 flex items-center gap-3 text-[14px]"><span className="flex-1">{i.email} · {i.role === "admin" ? t("Admin") : t("Clinician")}</span>
                  <button onClick={() => act("cancel_member_invite", { code: i.code }, "Invite cancelled")} className={btnSec}>Cancel</button></div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ───────────── SETTINGS ───────────── */

export function SettingsView({ clinicId, toast, onLang }: { clinicId: string; toast: (s: string) => void; onLang: (l: Lang) => void }) {
  const [name, setName] = useState(""), [me, setMe] = useState(""), [role, setRole] = useState("clinician");
  const [timeout, setTimeoutMin] = useState(30), [lang, setLangState] = useState<Lang>(LANG);
  useEffect(() => {
    api<{ clinic: { name: string; settings: { timeout_min?: number; language?: Lang } }; me: { display_name: string | null; role: string } }>("settings", { clinic_id: clinicId })
      .then((r) => { setName(r.clinic.name); setMe(r.me.display_name ?? ""); setRole(r.me.role); setTimeoutMin(r.clinic.settings?.timeout_min ?? 30); })
      .catch((e) => toast(e.message));
  }, [clinicId]); // eslint-disable-line react-hooks/exhaustive-deps
  const admin = role === "admin";
  const save = async () => {
    try {
      if (me.trim()) await api("update_me", { clinic_id: clinicId, display_name: me.trim() });
      if (admin) await api("update_clinic", { clinic_id: clinicId, name: name.trim(), settings: { timeout_min: timeout } });
      toast(t("Saved") + ". Reload to see the new names everywhere.");
    } catch (e) { toast((e as Error).message); }
  };
  return (
    <div>
      <h1 className={h1}>{t("Settings")}</h1>
      <section className={`${apple} mt-8 grid max-w-xl gap-4 p-6`}>
        <label className="text-[13px] font-medium">{t("Clinic name")}<input disabled={!admin} value={name} onChange={(e) => setName(e.target.value)} className={`${field} mt-1 disabled:opacity-50`} /></label>
        <label className="text-[13px] font-medium">{t("Your name, as patients see it")}<input value={me} onChange={(e) => setMe(e.target.value)} placeholder="Dr. …" className={`${field} mt-1`} /></label>
        <label className="text-[13px] font-medium">{t("Sign out after inactivity")}
          <select disabled={!admin} value={timeout} onChange={(e) => setTimeoutMin(Number(e.target.value))} className={`${field} mt-1 disabled:opacity-50`}>
            {[10, 15, 30, 60, 120].map((m) => <option key={m} className="text-black" value={m}>{m} {t("minutes")}</option>)}
          </select>
        </label>
        <label className="text-[13px] font-medium">{t("Language")}
          <select value={lang} onChange={(e) => { const l = e.target.value as Lang; setLangState(l); setLang(l); onLang(l); }} className={`${field} mt-1`}>
            <option className="text-black" value="en">English</option><option className="text-black" value="lt">Lietuvių</option>
          </select>
        </label>
        <div><button onClick={save} className={btnPri}>{t("Save")}</button></div>
        {!admin && <p className="text-[12px] text-white/55">Only clinic admins can change the clinic name and the sign-out time.</p>}
        <p className="text-[12px] text-white/55">Language applies to this browser. The main navigation and the new screens are translated; some detailed patient screens are still in English.</p>
      </section>
    </div>
  );
}

/* ───────────── AUDIT LOG ───────────── */

const ACTION_TEXT: Record<string, string> = {
  view_roster: "Opened the patient list", view_patient: "Opened a patient", patient_joined: "Patient joined", patient_revoked: "Patient stopped sharing",
  patient_changed_scopes: "Patient changed sharing", patient_shared_note: "Patient shared a note", ai_ask: "Asked the AI about a patient", ai_summary: "AI visit summary",
  labs_reviewed: "Marked labs reviewed", reminder_sent: "Sent a reminder", visit_logged: "Logged a visit", archive: "Archived a patient", unarchive: "Restored a patient",
  member_joined: "Colleague joined", member_removed: "Removed a colleague", clinic_settings_changed: "Changed clinic settings",
  update_plan: "Sent a plan change", update_note: "Sent a note", update_watching: "Changed what's watched", update_retest: "Set a retest",
};

export function AuditView({ clinicId, toast }: { clinicId: string; toast: (s: string) => void }) {
  const [rows, setRows] = useState<{ at: string; action: string; actor: string | null; patient: string | null }[] | null>(null);
  const [q, setQ] = useState("");
  useEffect(() => { api<{ entries: typeof rows }>("audit", { clinic_id: clinicId }).then((r) => setRows(r.entries)).catch((e) => { toast(e.message); setRows([]); }); }, [clinicId]); // eslint-disable-line react-hooks/exhaustive-deps
  const list = (rows ?? []).filter((r) => `${r.actor} ${r.patient} ${r.action}`.toLowerCase().includes(q.toLowerCase()));
  const csv = () => {
    const out = ["when,who,what,patient", ...list.map((r) => [r.at, r.actor ?? "", ACTION_TEXT[r.action.split(":")[0]] ?? r.action, r.patient ?? ""].map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([out], { type: "text/csv" })); a.download = "daygo-clinic-audit.csv"; a.click();
  };
  return (
    <div>
      <h1 className={h1}>{t("Audit log")}</h1>
      <p className="mt-2 text-[16px] text-white/75">Every time someone at the clinic opens or changes patient data. Admins only. Last 300 entries.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter" className={`${field} max-w-xs`} />
        <button onClick={csv} className={btnSec}>Download CSV</button>
      </div>
      <div className={`${apple} mt-6 overflow-x-auto px-5 py-2`}>
        <table className="w-full text-left text-[13.5px]">
          <thead className="text-[11px] uppercase tracking-wider text-white/55"><tr><th className="py-2">{t("When")}</th><th>{t("Who")}</th><th>{t("What")}</th><th>{t("Patient")}</th></tr></thead>
          <tbody>
            {list.map((r, i) => (
              <tr key={i} className="border-t border-white/10"><td className="whitespace-nowrap py-2.5 pr-4 text-white/70">{new Date(r.at).toLocaleString(LANG === "lt" ? "lt-LT" : "en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                <td className="pr-4">{r.actor ?? "—"}</td><td className="pr-4">{ACTION_TEXT[r.action.split(":")[0]] ?? r.action}</td><td>{r.patient ?? "—"}</td></tr>
            ))}
          </tbody>
        </table>
        {rows && !list.length && <p className="p-4 text-white/60">No entries.</p>}
      </div>
    </div>
  );
}

/* ───────────── VISIT HISTORY ───────────── */

type Visit = { id: string; visit_at: string; summary: string | null; by: string | null };

export function VisitHistory({ clinicId, p, toast }: { clinicId: string | null; p: Patient; toast: (s: string) => void }) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState(""), [next, setNext] = useState("");
  const load = () => { if (clinicId) api<{ visits: Visit[] }>("visits", { clinic_id: clinicId, patient_id: p.id }).then((r) => setVisits(r.visits)).catch(() => {}); };
  useEffect(load, [clinicId, p.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = async () => {
    if (!clinicId) { toast("Demo: visits are saved for real clinics only"); return; }
    try {
      await api("log_visit", { clinic_id: clinicId, patient_id: p.id, visit_at: `${date}T12:00:00Z`, summary, ...(next ? { next_visit_at: `${next}:00` } : {}) });
      setAdding(false); setSummary(""); setNext(""); load(); toast("Visit saved");
    } catch (e) { toast((e as Error).message); }
  };
  return (
    <section className={`${apple} p-6`}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className={h2}>{t("Visits")}</h2>
        <button onClick={() => setAdding(!adding)} className={`${btnSec} ml-auto`}>{adding ? "Cancel" : `+ ${t("Log a visit")}`}</button>
      </div>
      {adding && (
        <div className="mt-4 grid gap-3">
          <label className="text-[13px] font-medium">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${field} mt-1 [color-scheme:dark]`} /></label>
          <label className="text-[13px] font-medium">What was decided<textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} placeholder="Findings discussed, changes agreed, what to watch" className={`${field} mt-1`} /></label>
          <label className="text-[13px] font-medium">{t("Next visit")} (optional)<input type="datetime-local" value={next} onChange={(e) => setNext(e.target.value)} className={`${field} mt-1 [color-scheme:dark]`} /></label>
          <div><button onClick={save} className={btnPri}>{t("Save")}</button></div>
        </div>
      )}
      <ul className="mt-3">
        {visits.map((v) => (
          <li key={v.id} className="border-t border-white/12 py-3 first:border-0">
            <div className="text-[13px] text-white/60">{new Date(v.visit_at).toLocaleDateString(LANG === "lt" ? "lt-LT" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}{v.by ? ` · ${v.by}` : ""}</div>
            {v.summary && <p className="mt-1 whitespace-pre-wrap text-[14.5px]">{v.summary}</p>}
          </li>
        ))}
        {!visits.length && !adding && <li className="py-2 text-[14px] text-white/60">No visits recorded yet.</li>}
      </ul>
    </section>
  );
}

/* ───────────── EXPORT ───────────── */

/** Plain-text summary for pasting into the clinic's own records system. */
export function patientText(p: Patient, visits: Visit[] = []): string {
  const d30 = p.days.slice(-30);
  const f = (x: number | null, dec = 1) => (x == null ? "–" : x.toFixed(dec));
  const sum = summarise(p);
  const labs = [...p.labs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20);
  return [
    `${p.first} ${p.last}${p.age ? `, ${p.age}` : ""} · ${p.programme}`,
    `Exported ${new Date().toLocaleDateString("en-GB")} from Daygo for Clinics. Patient-shared data; not a diagnosis.`,
    "",
    "LAST 30 DAYS (averages)",
    `Sleep ${f(avg(d30.map((x) => x.sleepH)))} h · HRV ${f(avg(d30.map((x) => x.hrv)), 0)} ms · Resting HR ${f(avg(d30.map((x) => x.rhr)), 0)} bpm · Check-ins ${d30.filter((x) => x.mood != null).length}/${d30.length} days`,
    "",
    "SINCE LAST VISIT",
    ...sum.bullets.map((b) => `- ${b}`),
    ...(sum.missing.length ? [`Missing: ${sum.missing.join("; ")}`] : []),
    "",
    "LAB RESULTS",
    ...(labs.length ? labs.map((l) => `- ${l.date} ${MARKERS[l.marker]?.name ?? l.marker}: ${l.value} ${MARKERS[l.marker]?.unit ?? ""}`) : ["- none shared"]),
    "",
    "CARE PLAN",
    ...(p.update.watching.length ? [`Watching: ${p.update.watching.join(", ")}`] : []),
    ...p.update.plan.slice(0, 5).map((x) => `- ${x.at}: ${x.text}`),
    ...p.retests.filter((r) => r.status !== "done").map((r) => `- Retest: ${r.label}, due ${r.due}`),
    ...(visits.length ? ["", "VISITS", ...visits.slice(0, 10).map((v) => `- ${v.visit_at.slice(0, 10)}${v.by ? ` (${v.by})` : ""}: ${v.summary ?? ""}`)] : []),
    ...(p.patientNotes?.length ? ["", "LATEST NOTE FROM PATIENT", p.patientNotes[0].text] : []),
  ].join("\n");
}

export function ExportButtons({ clinicId, p, toast }: { clinicId: string | null; p: Patient; toast: (s: string) => void }) {
  const visits = useRef<Visit[]>([]);
  useEffect(() => { if (clinicId) api<{ visits: Visit[] }>("visits", { clinic_id: clinicId, patient_id: p.id }).then((r) => { visits.current = r.visits; }).catch(() => {}); }, [clinicId, p.id]);
  const copy = async () => { await navigator.clipboard.writeText(patientText(p, visits.current)); toast("Summary copied. Paste it into your records system."); };
  const print = () => {
    const w = window.open("", "_blank", "width=820,height=1000");
    if (!w) { toast("Allow pop-ups to print"); return; }
    const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(p.first)} ${esc(p.last)} · Daygo</title>
      <style>body{font:14px/1.5 -apple-system,Helvetica,Arial,sans-serif;color:#111;max-width:720px;margin:40px auto;padding:0 24px}pre{white-space:pre-wrap;font:inherit}h1{font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#666}</style>
      </head><body><h1>Daygo for Clinics</h1><pre>${esc(patientText(p, visits.current))}</pre><script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };
  return (
    <div className="flex gap-2">
      <button onClick={copy} className={btnSec}>Copy summary</button>
      <button onClick={print} className={btnSec}>{t("Export")} PDF</button>
    </div>
  );
}
