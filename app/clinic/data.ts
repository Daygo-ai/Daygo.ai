// Daygo for Clinics — Phase 1 demo data.
// Everything here is FICTIONAL example data. Types mirror the Phase 2
// data model (see app/clinic/PLAN.md) so the UI can later read from
// Supabase without reshaping.

export type ShareCategory = "wearables" | "checkins" | "tests";
export type Role = "clinician" | "admin";

export interface DayPoint {
  date: string; // ISO yyyy-mm-dd
  sleepH: number | null;
  hrv: number | null; // ms, overnight
  eveningHrv: number | null; // ms, last work hour 16–17h
  rhr: number | null; // bpm
  steps: number | null;
  mood: number | null; // 1–5
  energy: number | null; // 1–5
  symptoms: string[];
  food?: string;
  note?: string;
  workday: boolean;
}

export interface LabResult {
  marker: string; // slug
  value: number;
  date: string;
  reportId?: string; // groups values from one lab report
  reviewed?: boolean; // clinician has reviewed this value
  uploadedBy?: "patient" | "clinic";
  lab?: string;
}

export interface Retest {
  id: string;
  marker: string; // slug or screening id
  label: string;
  due: string;
  source: "clinician" | "guideline";
  sourceDetail: string; // "Dr. Ema Vaitkienė" or guideline reference
  status: "scheduled" | "reminded" | "result_in" | "done";
}

export interface CarePlanItem {
  id: string;
  text: string;
  at: string;
}

export interface ClinicianUpdate {
  watching: string[];
  plan: CarePlanItem[];
  notes: { id: string; text: string; at: string; by: string }[];
}

export interface Patient {
  id: string;
  first: string;
  last: string;
  age: number;
  sex: "F" | "M";
  programme: string;
  device: string;
  lastSync: string; // human
  enrolled: string;
  status: "invited" | "joined" | "data_flowing" | "revoked";
  sharing: Record<ShareCategory, boolean>;
  lastVisit: string;
  nextVisit: string | null; // ISO datetime
  days: DayPoint[]; // 90 days, oldest first
  labs: LabResult[];
  retests: Retest[];
  update: ClinicianUpdate;
  /** Notes the patient prepared (with Daygo) and chose to share. */
  patientNotes?: { id: string; text: string; at: string; ai: boolean }[];
  color: string;
}

// Demo runs on a fixed date; live mode switches to the real date.
export let TODAY = "2026-11-18";
export let CLINICIAN_NAME = "Dr. Ema Vaitkienė";
export function setLiveContext(clinician: string) {
  TODAY = new Date().toLocaleDateString("en-CA");
  CLINICIAN_NAME = clinician;
}
export const CLINICIAN = "Dr. Ema Vaitkienė";

export const MARKERS: Record<string, { name: string; unit: string; lo: number; hi: number }> = {
  ferritin: { name: "Ferritin", unit: "ng/mL", lo: 30, hi: 300 },
  "vitamin-d": { name: "Vitamin D", unit: "ng/mL", lo: 30, hi: 60 },
  hba1c: { name: "HbA1c", unit: "%", lo: 4.0, hi: 5.6 },
  tsh: { name: "TSH", unit: "mIU/L", lo: 0.4, hi: 4.0 },
  ldl: { name: "LDL cholesterol", unit: "mmol/L", lo: 0, hi: 3.0 },
  b12: { name: "Vitamin B12", unit: "pg/mL", lo: 200, hi: 900 },
  hemoglobin: { name: "Hemoglobin", unit: "g/L", lo: 120, hi: 155 },
  crp: { name: "CRP", unit: "mg/L", lo: 0, hi: 5 },
};

// Guideline schedules. Sources must be verified with a clinical advisor
// before the pilot; shown in the UI with "verify" status in PLAN.md.
export const GUIDELINES = {
  cervical: {
    label: "Cervical screening",
    source: "Lithuanian national cervical cancer prevention programme · women 25–59 · every 3 years",
  },
  breast: {
    label: "Breast screening (mammogram)",
    source: "Lithuanian national breast cancer prevention programme · women 50–69 · every 2 years",
  },
  bowel: {
    label: "Bowel screening (FIT test)",
    source: "Lithuanian national colorectal cancer prevention programme · ages 50–74 · every 2 years",
  },
  heart: {
    label: "Heart health check",
    source: "Lithuanian national cardiovascular prevention programme · men 40–55, women 50–65 · yearly",
  },
};

// ---------- deterministic generator ----------
let s = 11;
const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const iso = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (isoDate: string, n: number) => {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() + n);
  return iso(d);
};

const FOODS = ["Oats and berries", "Late dinner", "Salad lunch", "Pizza with friends", "Skipped lunch", "Fish and vegetables", "Lots of coffee"];
const NOTES = ["Walked to work.", "Long day.", "Felt good after the gym.", "Bad night, woke at 4.", "Busy week.", "Headache in the afternoon."];

function genDays(o: {
  sleep: number; hrv: number; rhr: number; steps: number; logRate: number;
  workStress?: boolean; syms: string[];
}): DayPoint[] {
  const out: DayPoint[] = [];
  for (let i = 89; i >= 0; i--) {
    const date = addDays(TODAY, -i);
    const dow = new Date(date + "T12:00:00").getDay();
    const workday = dow >= 1 && dow <= 5;
    const logged = r() < o.logRate;
    const stressDay = !!o.workStress && workday && (dow >= 3 || r() < 0.4);
    const hrv = Math.round(o.hrv + (r() - 0.5) * 10 - (stressDay ? 4 : 0));
    const ev = Math.round(hrv - (stressDay ? 11 + r() * 6 : 1 + r() * 4));
    out.push({
      date,
      workday,
      sleepH: +clamp(o.sleep + (r() - 0.5) * 1.4 - (stressDay ? 0.4 : 0), 4.2, 9).toFixed(1),
      hrv,
      eveningHrv: ev,
      rhr: Math.round(o.rhr + (r() - 0.5) * 4 + (stressDay ? 2 : 0)),
      steps: Math.round(clamp(o.steps + (r() - 0.5) * 5000, 1200, 20000)),
      mood: logged ? clamp(Math.round(3.6 + (r() - 0.5) * 2 - (stressDay ? 0.8 : 0)), 1, 5) : null,
      energy: logged ? clamp(Math.round(3.4 + (r() - 0.5) * 2 - (stressDay ? 0.9 : 0)), 1, 5) : null,
      symptoms: logged ? o.syms.filter(() => r() < 0.2) : [],
      food: logged && r() < 0.5 ? FOODS[Math.floor(r() * FOODS.length)] : undefined,
      note: logged && r() < 0.15 ? NOTES[Math.floor(r() * NOTES.length)] : undefined,
    });
  }
  return out;
}

const COLORS = ["#4C6B4F", "#7A6A4F", "#4F5F7A", "#7A4F5F", "#5F7A4F", "#4F7A72"];

function base(i: number, p: Partial<Patient> & Pick<Patient, "first" | "last" | "age" | "sex" | "programme">): Patient {
  return {
    id: "p" + i,
    device: "Apple Watch",
    lastSync: "2 h ago",
    enrolled: addDays(TODAY, -100),
    status: "data_flowing",
    sharing: { wearables: true, checkins: true, tests: true },
    lastVisit: addDays(TODAY, -42),
    nextVisit: null,
    days: [],
    labs: [],
    retests: [],
    update: { watching: [], plan: [], notes: [] },
    color: COLORS[i % COLORS.length],
    ...p,
  };
}

// ---------- Rūta: the primary demo patient ----------
const ruta = base(0, {
  first: "Rūta", last: "Jankauskienė", age: 47, sex: "F", programme: "Preventive care",
  device: "Apple Watch", lastSync: "40 min ago", lastVisit: addDays(TODAY, -91),
  nextVisit: TODAY + "T10:00",
  days: genDays({ sleep: 6.8, hrv: 44, rhr: 62, steps: 7800, logRate: 0.85, workStress: true, syms: ["Tiredness", "Headache", "Tension in shoulders"] }),
  labs: [
    { marker: "ferritin", value: 41, date: addDays(TODAY, -460) },
    { marker: "ferritin", value: 22, date: addDays(TODAY, -95) },
    { marker: "ferritin", value: 34, date: addDays(TODAY, -3) },
    { marker: "hemoglobin", value: 118, date: addDays(TODAY, -95) },
    { marker: "hemoglobin", value: 126, date: addDays(TODAY, -3) },
    { marker: "crp", value: 1.2, date: addDays(TODAY, -3) },
    { marker: "vitamin-d", value: 24, date: addDays(TODAY, -95) },
    { marker: "vitamin-d", value: 31, date: addDays(TODAY, -3) },
    { marker: "tsh", value: 1.9, date: addDays(TODAY, -95) },
    { marker: "hba1c", value: 5.3, date: addDays(TODAY, -95) },
  ],
  retests: [
    { id: "rt1", marker: "ferritin", label: "Ferritin retest", due: addDays(TODAY, -5), source: "clinician", sourceDetail: CLINICIAN, status: "result_in" },
    { id: "rt2", marker: "cervical", label: GUIDELINES.cervical.label, due: addDays(TODAY, 40), source: "guideline", sourceDetail: GUIDELINES.cervical.source, status: "scheduled" },
    { id: "rt3", marker: "vitamin-d", label: "Vitamin D retest", due: addDays(TODAY, 85), source: "clinician", sourceDetail: CLINICIAN, status: "scheduled" },
  ],
  update: {
    watching: ["Iron levels", "Sleep"],
    plan: [{ id: "c1", text: "Iron supplement every other morning, with vitamin C", at: addDays(TODAY, -91) }],
    notes: [{ id: "n1", text: "Let's recheck ferritin in 3 months and see how your energy feels.", at: addDays(TODAY, -91), by: CLINICIAN }],
  },
});
// Rūta's own words on two workdays
ruta.days[ruta.days.length - 2].note = "Stressful week at work, tired by 5pm.";
ruta.days[ruta.days.length - 9].note = "Stressful week, deadlines.";
ruta.days[ruta.days.length - 1].note = "Energy a bit better since the iron.";

const others: Patient[] = [
  base(1, { first: "Tomas", last: "Kazlauskas", age: 52, sex: "M", programme: "Heart health", device: "Garmin", lastSync: "5 h ago", nextVisit: TODAY + "T12:00",
    days: genDays({ sleep: 7.1, hrv: 38, rhr: 64, steps: 9000, logRate: 0.6, syms: ["Knee pain"] }),
    labs: [{ marker: "ldl", value: 3.8, date: addDays(TODAY, -200) }, { marker: "ldl", value: 3.3, date: addDays(TODAY, -10) }, { marker: "hba1c", value: 5.7, date: addDays(TODAY, -10) }],
    retests: [{ id: "t1", marker: "heart", label: GUIDELINES.heart.label, due: addDays(TODAY, -12), source: "guideline", sourceDetail: GUIDELINES.heart.source, status: "reminded" },
      { id: "t2", marker: "bowel", label: GUIDELINES.bowel.label, due: addDays(TODAY, 20), source: "guideline", sourceDetail: GUIDELINES.bowel.source, status: "scheduled" }] }),
  base(2, { first: "Agnė", last: "Petraitytė", age: 34, sex: "F", programme: "Nutrition", device: "Oura", lastSync: "1 h ago", nextVisit: TODAY + "T15:00",
    days: genDays({ sleep: 7.4, hrv: 58, rhr: 57, steps: 8500, logRate: 0.9, syms: ["Bloating", "Low energy"] }),
    labs: [{ marker: "b12", value: 260, date: addDays(TODAY, -60) }, { marker: "vitamin-d", value: 28, date: addDays(TODAY, -60) }],
    retests: [{ id: "t3", marker: "b12", label: "Vitamin B12 retest", due: addDays(TODAY, 30), source: "clinician", sourceDetail: CLINICIAN, status: "scheduled" }] }),
  base(3, { first: "Lukas", last: "Vaitkus", age: 41, sex: "M", programme: "Preventive care", device: "Whoop", lastSync: "3 days ago", nextVisit: addDays(TODAY, 2) + "T09:30",
    days: genDays({ sleep: 6.3, hrv: 49, rhr: 59, steps: 6200, logRate: 0.25, syms: ["Poor sleep"] }),
    labs: [{ marker: "tsh", value: 2.4, date: addDays(TODAY, -300) }],
    retests: [{ id: "t4", marker: "tsh", label: "TSH retest", due: addDays(TODAY, -30), source: "clinician", sourceDetail: CLINICIAN, status: "scheduled" }] }),
  base(4, { first: "Eglė", last: "Žukauskaitė", age: 56, sex: "F", programme: "Preventive care", device: "Apple Watch", nextVisit: addDays(TODAY, 3) + "T11:00",
    days: genDays({ sleep: 7.0, hrv: 33, rhr: 66, steps: 7000, logRate: 0.75, syms: ["Hot flushes", "Poor sleep"] }),
    labs: [{ marker: "vitamin-d", value: 45, date: addDays(TODAY, -2) }, { marker: "ldl", value: 2.9, date: addDays(TODAY, -2) }],
    retests: [{ id: "t5", marker: "breast", label: GUIDELINES.breast.label, due: addDays(TODAY, 10), source: "guideline", sourceDetail: GUIDELINES.breast.source, status: "scheduled" },
      { id: "t6", marker: "vitamin-d", label: "Vitamin D retest", due: addDays(TODAY, -4), source: "clinician", sourceDetail: CLINICIAN, status: "result_in" }] }),
  base(5, { first: "Mantas", last: "Paulauskas", age: 29, sex: "M", programme: "Sports recovery", device: "Garmin", nextVisit: addDays(TODAY, 6) + "T17:00",
    days: genDays({ sleep: 7.8, hrv: 72, rhr: 50, steps: 12000, logRate: 0.7, syms: ["Calf tightness"] }) }),
  base(6, { first: "Greta", last: "Stankevičiūtė", age: 38, sex: "F", programme: "Nutrition", device: "iPhone only", lastSync: "6 days ago",
    days: genDays({ sleep: 6.9, hrv: 50, rhr: 63, steps: 5000, logRate: 0.15, syms: ["Bloating"] }),
    retests: [{ id: "t7", marker: "cervical", label: GUIDELINES.cervical.label, due: addDays(TODAY, -60), source: "guideline", sourceDetail: GUIDELINES.cervical.source, status: "reminded" }] }),
  base(7, { first: "Jonas", last: "Butkus", age: 61, sex: "M", programme: "Heart health", device: "Apple Watch", nextVisit: addDays(TODAY, 1) + "T08:30",
    days: genDays({ sleep: 6.6, hrv: 29, rhr: 68, steps: 5500, logRate: 0.8, syms: ["Breathless on stairs"] }),
    labs: [{ marker: "hba1c", value: 6.1, date: addDays(TODAY, -180) }, { marker: "hba1c", value: 5.9, date: addDays(TODAY, -1) }],
    retests: [{ id: "t8", marker: "hba1c", label: "HbA1c retest", due: addDays(TODAY, -2), source: "clinician", sourceDetail: CLINICIAN, status: "result_in" },
      { id: "t9", marker: "bowel", label: GUIDELINES.bowel.label, due: addDays(TODAY, 14), source: "guideline", sourceDetail: GUIDELINES.bowel.source, status: "scheduled" }] }),
  base(8, { first: "Ieva", last: "Urbonaitė", age: 44, sex: "F", programme: "Preventive care", device: "Oura",
    days: genDays({ sleep: 7.2, hrv: 47, rhr: 60, steps: 8000, logRate: 0.65, syms: ["Headache"] }),
    retests: [{ id: "t10", marker: "ferritin", label: "Ferritin retest", due: addDays(TODAY, 12), source: "clinician", sourceDetail: CLINICIAN, status: "scheduled" }] }),
  base(9, { first: "Darius", last: "Navickas", age: 49, sex: "M", programme: "Heart health", device: "Garmin", lastSync: "4 days ago",
    days: genDays({ sleep: 6.1, hrv: 35, rhr: 67, steps: 4800, logRate: 0.2, syms: [] }),
    retests: [{ id: "t11", marker: "heart", label: GUIDELINES.heart.label, due: addDays(TODAY, 25), source: "guideline", sourceDetail: GUIDELINES.heart.source, status: "scheduled" }] }),
  base(10, { first: "Laura", last: "Kavaliauskienė", age: 27, sex: "F", programme: "Nutrition", device: "Apple Watch", status: "invited", lastSync: "Not connected",
    sharing: { wearables: false, checkins: false, tests: false }, days: [] }),
  base(11, { first: "Paulius", last: "Ramanauskas", age: 36, sex: "M", programme: "Sports recovery", device: "Whoop", status: "joined", lastSync: "Waiting for first sync",
    days: [] }),
];

export const DEMO_PATIENTS: Patient[] = [ruta, ...others];

// Group labs into reports and mark anything after the last visit as not yet reviewed.
DEMO_PATIENTS.forEach((p) => {
  p.labs.forEach((l) => {
    l.reportId = `${p.id}-${l.date}`;
    l.reviewed = l.date <= p.lastVisit;
    l.uploadedBy = p.id === "p0" || p.id === "p4" ? "patient" : "clinic";
    l.lab = "Example Lab";
  });
});

/** Values a demo "PDF extraction" fills in. Real extraction is Phase 2. */
export const DEMO_EXTRACT: { marker: string; value: number }[] = [
  { marker: "ferritin", value: 48 },
  { marker: "hemoglobin", value: 131 },
  { marker: "vitamin-d", value: 36 },
  { marker: "crp", value: 0.8 },
];

export const PROGRAMMES = ["Preventive care", "Heart health", "Nutrition", "Sports recovery"];

export const WATCH_OPTIONS = ["Iron levels", "Sleep", "Evening work stress", "Energy", "Vitamin D", "Blood sugar", "Cholesterol", "Recovery", "Digestion", "Weight"];

// Pricing is configuration, not code. Amounts are placeholders.
export const PLAN_CONFIG = {
  name: "Pilot",
  baseMonthly: null as number | null, // set per clinic contract
  perActivePatient: null as number | null,
  activeDefinition: "Patient with data shared in the last 30 days",
};
