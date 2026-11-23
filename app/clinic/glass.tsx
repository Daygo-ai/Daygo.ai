"use client";

import { useMemo, useState } from "react";

/*
 * Glass system for Daygo Clinic.
 * - Frosted base: cool grey with slow drifting colour fields behind everything.
 * - Glass panels: translucent white, backdrop blur, 1px light edge, soft shadow.
 * - Aura cards: one colour mood per metric, made of blurred drifting blobs +
 *   grain, with dot-matrix numerals on top. Text always sits on a darkened
 *   layer so contrast holds (glassmorphism skill: contrast first).
 */

export const AURAS = {
  sleep: ["#1B2440", "#2C4C7A", "#5FB3C6", "#8A6BA8"],
  hrv: ["#1E1A3A", "#4A3F8F", "#7E8FD6", "#3B6E8F"],
  rhr: ["#3A1414", "#B5432E", "#F08A3C", "#F6C35B"],
  steps: ["#1D2B22", "#3E6B4F", "#9BCB8A", "#5F8F7A"],
  mood: ["#3A1838", "#C24D9A", "#F28BB0", "#7C3FA0"],
  energy: ["#3A2312", "#D9662B", "#F5A447", "#F7D16A"],
  watch: ["#1F261D", "#4C6B4F", "#B9D97A", "#5FB3C6"],
} as const;
export type AuraKey = keyof typeof AURAS;

export const glass =
  "rounded-[28px] border border-white/60 bg-white/85 text-[#111518] shadow-[0_1px_0_rgba(255,255,255,.8)_inset,0_20px_50px_-24px_rgba(30,40,50,.35)] backdrop-blur-2xl backdrop-saturate-150";
export const glassDark =
  "rounded-[28px] border border-white/10 bg-[#141a1f]/80 text-white shadow-[0_1px_0_rgba(255,255,255,.08)_inset,0_30px_60px_-24px_rgba(10,15,20,.6)] backdrop-blur-2xl";
export const pill =
  "rounded-full border border-white/20 bg-white/[.08] px-4 py-1.5 text-[14px] text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,.2)] backdrop-blur-xl transition hover:bg-white/15 hover:text-white";
export const pillOn = "rounded-full bg-white px-4 py-1.5 text-[14px] font-medium text-[#111518] shadow-[0_6px_20px_-8px_rgba(0,0,0,.35)]";
export const iconBtn =
  "grid h-11 w-11 place-items-center rounded-full border border-[#111518]/15 bg-white/30 text-[#111518] backdrop-blur-xl transition hover:bg-white/70";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Page background: frosted grey with slow colour fields. */
export function FrostBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#1b1a19]">
      <div className="absolute inset-0 bg-[url('/clinic/athlete.webp')] bg-cover bg-[68%_25%]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,19,18,.88)_0%,rgba(20,19,18,.62)_38%,rgba(20,19,18,.28)_70%,rgba(20,19,18,.2)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,19,18,.75),transparent_45%)]" />
      <div className="absolute inset-0 opacity-[.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <style>{`
        @keyframes drift1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(6vw,4vh) scale(1.08)}}
        @keyframes drift2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-5vw,6vh) scale(.95)}}
        @keyframes drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(4vw,-5vh)}}
        @keyframes photo{0%,100%{transform:scale(1.02) translate(0,0)}50%{transform:scale(1.06) translate(-1%,-1%)}}
        .photo-drift{animation:photo 40s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.photo-drift,.aura-b{animation:none!important}}
      `}</style>
    </div>
  );
}

/** Blurred, drifting colour field used inside aura cards. */
export function Aura({ k, className = "", intensity = 1 }: { k: AuraKey; className?: string; intensity?: number }) {
  const [a, b, c, d] = AURAS[k];
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ background: a }}>
      <div className="aura-b absolute -left-1/4 -top-1/3 h-[110%] w-[90%] rounded-full blur-[40px]" style={{ background: b, opacity: 0.9 * intensity, animation: "drift1 14s ease-in-out infinite" }} />
      <div className="aura-b absolute -bottom-1/3 left-1/4 h-[90%] w-[80%] rounded-full blur-[46px]" style={{ background: c, opacity: 0.85 * intensity, animation: "drift2 18s ease-in-out infinite" }} />
      <div className="aura-b absolute -right-1/4 top-0 h-[80%] w-[60%] rounded-full blur-[50px]" style={{ background: d, opacity: 0.7 * intensity, animation: "drift3 22s ease-in-out infinite" }} />
      <div className="absolute inset-0 opacity-[.18] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18),transparent_45%,rgba(0,0,0,.12))]" />
    </div>
  );
}

/** Smooth catmull-rom path through points. */
function smooth(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

/** Hero chart from the reference: smooth white curve on an aura, day buttons below. */
export function AuraCurve({ title, k, values, labels, unit, dec = 0, dayLetters }: {
  title: string; k: AuraKey; values: (number | null)[]; labels: string[]; unit: string; dec?: number; dayLetters: string[];
}) {
  const [sel, setSel] = useState(values.length - 1);
  const W = 600, H = 200;
  const { pts, avgY } = useMemo(() => {
    const v = values.filter((x): x is number => x != null);
    const mn = Math.min(...v), mx = Math.max(...v), r = mx - mn || 1;
    const y = (n: number) => H - 30 - ((n - (mn - r * 0.2)) / (r * 1.4)) * (H - 60);
    const pts = values.map((n, i) => [22 + (i / (values.length - 1 || 1)) * (W - 44),y(n ?? v.reduce((a, b) => a + b, 0) / v.length)] as [number, number]);
    return { pts, avgY: y(v.reduce((a, b) => a + b, 0) / v.length) };
  }, [values]);
  const cur = values[sel];
  return (
    <div className="relative overflow-hidden rounded-[34px] text-white shadow-[0_30px_60px_-30px_rgba(20,30,50,.7)]">
      <Aura k={k} />
      <div className="relative p-6 md:p-7">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[18px] font-medium text-white/90">{title}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-dots text-[54px] leading-none tracking-tight">{cur == null ? "––" : cur.toFixed(dec)}</span>
              <span className="text-[14px] text-white/70">{unit}</span>
            </div>
            <div className="mt-1 text-[13px] text-white/70">{labels[sel]}</div>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-full border border-white/30 text-[18px] text-white/80">↗</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" preserveAspectRatio="none" style={{ height: 170 }}>
          <line x1="0" x2={W} y1={avgY} y2={avgY} stroke="white" strokeOpacity=".3" strokeDasharray="2 6" />
          <path d={smooth(pts)} fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" className="curve-draw" />
          {pts[sel] && <>
            <line x1={pts[sel][0]} x2={pts[sel][0]} y1={pts[sel][1]} y2={H} stroke="white" strokeOpacity=".5" strokeDasharray="2 4" />
            <circle cx={pts[sel][0]} cy={pts[sel][1]} r="16" fill="white" fillOpacity=".18" stroke="white" strokeOpacity=".5" />
            <circle cx={pts[sel][0]} cy={pts[sel][1]} r="4" fill="white" />
          </>}
        </svg>
        <div className="mt-3 flex justify-between gap-1">
          {dayLetters.map((d, i) => (
            <button key={i} onClick={() => setSel(i)} aria-label={labels[i]}
              className={`grid h-10 w-10 place-items-center rounded-full text-[12px] transition ${i === sel ? "bg-white font-semibold text-[#111518] shadow-lg" : "border border-white/25 text-white/70 hover:bg-white/10"}`}>{d}</button>
          ))}
        </div>
      </div>
      <style>{`.curve-draw{stroke-dasharray:1400;stroke-dashoffset:1400;animation:cd 1.4s cubic-bezier(.3,.7,.2,1) forwards}@keyframes cd{to{stroke-dashoffset:0}}@media (prefers-reduced-motion:reduce){.curve-draw{animation:none;stroke-dashoffset:0}}`}</style>
    </div>
  );
}

/** Pill-shaped metric tile with dot-matrix number and change pill. */
export function AuraPill({ k, label, value, unit, change, spark }: {
  k: AuraKey; label: string; value: string; unit: string; change?: string; spark?: (number | null)[];
}) {
  const path = useMemo(() => {
    if (!spark) return "";
    const v = spark.filter((x): x is number => x != null);
    if (v.length < 2) return "";
    const mn = Math.min(...v), mx = Math.max(...v), r = mx - mn || 1;
    return smooth(spark.map((n, i) => [(i / (spark.length - 1)) * 100, 34 - (((n ?? mn) - mn) / r) * 26] as [number, number]));
  }, [spark]);
  return (
    <div className="relative overflow-hidden rounded-[40px] px-6 py-5 text-white shadow-[0_24px_40px_-24px_rgba(20,30,50,.7)]">
      <Aura k={k} />
      <div className="relative">
        <div className="text-center text-[13px] text-white/85">{label}</div>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div className="flex items-baseline gap-1.5"><span className="font-dots text-[40px] leading-none">{value}</span><span className="text-[12px] text-white/70">{unit}</span></div>
          {change && <span className="rounded-full border border-white/40 bg-white/10 px-2.5 py-0.5 text-[12px] backdrop-blur">{change}</span>}
        </div>
        {path && <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mt-2 h-8 w-full"><path d={path} fill="none" stroke="white" strokeOpacity=".75" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /></svg>}
      </div>
    </div>
  );
}

export const changePill = (a: number | null, b: number | null) => {
  if (a == null || b == null || !a) return undefined;
  const p = Math.round(((b - a) / a) * 100);
  return `${p > 0 ? "↑" : p < 0 ? "↓" : ""} ${Math.abs(p)}%`;
};

/* ── Reference style: soft static gradients, white type ── */
export const ACCENT = "#E6E46C";
const SMOKE = "linear-gradient(160deg,rgba(70,64,58,.62) 0%,rgba(34,32,30,.58) 100%)";
export const GRAD = {
  pink: SMOKE,
  teal: SMOKE,
  orange: "linear-gradient(160deg,rgba(84,72,58,.66) 0%,rgba(40,34,30,.62) 100%)",
  violet: SMOKE,
  slate: "linear-gradient(180deg,#34312E 0%,#232120 60%,#1B1A19 100%)",
  night: "linear-gradient(160deg,#3A3632 0%,#211F1D 100%)",
} as const;
export type GradKey = keyof typeof GRAD;
export const gradShadow: Record<GradKey, string> = {
  pink: "0 20px 40px -20px rgba(0,0,0,.55)", teal: "0 20px 40px -20px rgba(0,0,0,.55)", orange: "0 20px 40px -20px rgba(0,0,0,.55)",
  violet: "0 20px 40px -20px rgba(0,0,0,.55)", slate: "0 30px 60px -30px rgba(0,0,0,.6)", night: "0 30px 60px -30px rgba(0,0,0,.6)",
};
export const gradStyle = (k: GradKey) => ({ background: GRAD[k], boxShadow: `${gradShadow[k]}, inset 0 1px 0 rgba(255,255,255,.18)`, backdropFilter: "blur(22px) saturate(140%)", WebkitBackdropFilter: "blur(22px) saturate(140%)", border: "1px solid rgba(255,255,255,.14)" });

const I = {
  users: "M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 19v-1a4 4 0 00-3-3.9M15.5 3.2a3.5 3.5 0 010 6.6",
  flask: "M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 006 21h12a1.7 1.7 0 001.5-2.5L14 9V3M7 15h10",
  cal: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4",
  bell: "M6 16V11a6 6 0 1112 0v5l2 2H4zM10 21h4",
  home: "M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
  plus: "M12 5v14M5 12h14",
  phone: "M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2zM11 18h2",
  arrow: "M5 12h14M13 6l6 6-6 6",
  clinic: "M4 21V7l8-4 8 4v14M9 21v-5h6v5M12 8v4M10 10h4",
} as const;
export function Icon({ n, className = "h-5 w-5" }: { n: keyof typeof I; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden><path d={I[n]} /></svg>;
}

export function StatCard({ g, icon, value, label, onClick }: { g: GradKey; icon: keyof typeof I; value: string | number; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={gradStyle(g)} className="group relative overflow-hidden rounded-[24px] p-5 text-left text-white transition hover:-translate-y-0.5 active:scale-[.98]">
      <div className="flex items-center justify-between"><span className="text-[11px] font-medium uppercase tracking-[.14em] text-white/75">{label}</span><span className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white/80 transition group-hover:bg-white/10">↗</span></div>
      <div className="mt-5 flex items-end gap-2"><span className="text-[44px] font-light leading-none tracking-tight">{value}</span><Icon n={icon} className="mb-1.5 h-5 w-5 text-white/60" /></div>
      <div className="mt-4 h-[3px] w-full rounded-full bg-white/10"><div className="h-full w-1/3 rounded-full" style={{ background: ACCENT }} /></div>
    </button>
  );
}

/** Apple-style glass material: heavy blur + saturation, hairline light edge, top specular, soft depth. */
export const apple =
  "relative isolate rounded-[28px] border border-white/[.16] bg-white/[.07] shadow-[inset_0_1px_0_rgba(255,255,255,.30),inset_0_-1px_0_rgba(255,255,255,.05),0_24px_50px_-26px_rgba(0,0,0,.6)] backdrop-blur-[40px] backdrop-saturate-[180%] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[linear-gradient(140deg,rgba(255,255,255,.16)_0%,rgba(255,255,255,.02)_38%,rgba(255,255,255,0)_60%,rgba(255,255,255,.05)_100%)]";

/*
 * Liquid glass: the backdrop is bent through an SVG displacement map.
 * Map = red ramp left→right + green ramp top→bottom, with a neutral grey
 * centre, so only the rim refracts (lens edge). Chromium supports url()
 * in backdrop-filter; other browsers get clear glass with a light blur.
 */
const MAP = "data:image/svg+xml," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>" +
  "<defs><linearGradient id='r' x1='0' x2='1'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#f00'/></linearGradient>" +
  "<linearGradient id='g' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#0f0'/></linearGradient>" +
  "<filter id='b' x='-20%' y='-20%' width='140%' height='140%'><feGaussianBlur stdDeviation='5'/></filter></defs>" +
  "<rect width='100' height='100' fill='url(#r)'/><rect width='100' height='100' fill='url(#g)' style='mix-blend-mode:screen'/>" +
  "<rect x='9' y='9' width='82' height='82' rx='10' fill='#808080' filter='url(#b)'/></svg>");

export function LiquidGlassDefs() {
  return (
    <>
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <filter id="dg-liquid" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" primitiveUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
          <feImage href={MAP} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="0.09" xChannelSelector="R" yChannelSelector="G" result="bent" />
          <feGaussianBlur in="bent" stdDeviation="0.002" />
        </filter>
      </svg>
      <style>{`
        .liquid{will-change:auto;backdrop-filter:blur(10px) saturate(170%) brightness(1.05);-webkit-backdrop-filter:blur(10px) saturate(170%) brightness(1.05)}
        html.lg-on .liquid.bend{backdrop-filter:url(#dg-liquid) blur(5px) saturate(170%) brightness(1.05);-webkit-backdrop-filter:url(#dg-liquid) blur(5px) saturate(170%) brightness(1.05)}
      `}</style>
    </>
  );
}

export const liquid =
  "liquid relative isolate rounded-[30px] border border-white/[.12] bg-[rgba(20,20,22,.2)] shadow-[inset_1px_1px_0_rgba(255,255,255,.26),inset_-1px_-1px_0_rgba(255,255,255,.07),inset_0_0_20px_rgba(255,255,255,.04),0_20px_44px_-22px_rgba(0,0,0,.55)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[radial-gradient(120%_70%_at_10%_0%,rgba(255,255,255,.12),transparent_45%),radial-gradient(90%_60%_at_100%_100%,rgba(255,255,255,.04),transparent_50%)]";
