"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Per-card animated visualizations for the "Six moments" section.
 * One small loop running inside each card — the ocoya.com / Linear
 * style where every block has something alive in it.
 *
 * All vizzes accept a `tone` prop:
 *   "dark" — for un-highlighted cards (white / lime accents on dark)
 *   "lime" — for the currently active card (dark on lime, inverted)
 *
 * Each viz is sized for ~110px tall, full card width. Loops
 * continuously via TimelineView / setInterval so they're alive even
 * when not in view (the LazyVStack lazy mount handles cost).
 */

export type MomentVizTone = "dark" | "lime";

export interface VizProps {
  tone: MomentVizTone;
}

// ----------------------------------------------------------------------------
// PulseHR — heartbeat-like sparkline that pulses, resets, repeats
// ----------------------------------------------------------------------------
export function PulseHR({ tone }: VizProps) {
  const stroke = tone === "lime" ? "#0A0A10" : "#C8FF55";
  const dim = tone === "lime" ? "rgba(10,10,16,0.35)" : "rgba(255,255,255,0.20)";

  return (
    <div className="relative h-[90px] w-full overflow-hidden">
      <svg
        viewBox="0 0 320 90"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        {/* Faint baseline for context */}
        <line
          x1="0"
          y1="65"
          x2="320"
          y2="65"
          stroke={dim}
          strokeWidth="0.8"
          strokeDasharray="3 3"
        />
        {/* Pulse waveform — drawn once, then fades and repeats */}
        <motion.path
          d="M0,65 L40,65 L55,65 L60,55 L65,80 L70,28 L75,75 L80,65 L120,65 L150,65 L165,55 L170,80 L175,28 L180,75 L185,65 L240,65 L260,65 L275,55 L280,80 L285,28 L290,75 L295,65 L320,65"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3.2,
            times: [0, 0.65, 1],
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </svg>
      <span
        className={`absolute right-3 top-2 text-[9px] font-semibold uppercase tracking-widest ${
          tone === "lime" ? "text-accent-on/60" : "text-white/45"
        }`}
      >
        Heart rate
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// StaggerList — list items reveal one after another, then reset
// ----------------------------------------------------------------------------
export function StaggerList({
  tone,
  items,
  label = "This week",
}: VizProps & { items: string[]; label?: string }) {
  const itemColor =
    tone === "lime" ? "text-accent-on" : "text-white/85";
  const dotColor =
    tone === "lime" ? "bg-accent-on" : "bg-accent";
  const labelColor =
    tone === "lime" ? "text-accent-on/55" : "text-white/45";

  return (
    <div className="relative h-[110px] w-full overflow-hidden">
      <span
        className={`mb-1 block text-[9px] font-semibold uppercase tracking-widest ${labelColor}`}
      >
        {label}
      </span>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <motion.li
            key={i}
            className="flex items-center gap-2 text-[12px]"
            initial={{ opacity: 0, x: -6 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [-6, 0, 0, -6],
            }}
            transition={{
              duration: 4.5,
              times: [0, 0.18, 0.85, 1],
              delay: i * 0.35,
              repeat: Infinity,
              repeatDelay: items.length * 0.35,
              ease: "easeInOut",
            }}
          >
            <span className={`block h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
            <span className={`truncate ${itemColor}`}>{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

// ----------------------------------------------------------------------------
// CountTicker — counts between two values, with a tiny declining sparkline
// ----------------------------------------------------------------------------
export function CountTicker({
  tone,
  from,
  to,
  unit,
  label,
}: VizProps & { from: number; to: number; unit: string; label: string }) {
  const [n, setN] = useState(from);
  const valueColor = tone === "lime" ? "text-accent-on" : "text-white";
  const labelColor =
    tone === "lime" ? "text-accent-on/55" : "text-white/45";
  const stroke = tone === "lime" ? "#0A0A10" : "#C8FF55";

  useEffect(() => {
    let cancelled = false;
    let dir: "down" | "up" = "down";
    const tick = (target: number, ms: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const startN = n;
        function step(t: number) {
          if (cancelled) return resolve();
          const p = Math.min(1, (t - start) / ms);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(startN + (target - startN) * eased));
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      });

    (async function loop() {
      while (!cancelled) {
        await tick(dir === "down" ? to : from, 1800);
        await new Promise((r) => setTimeout(r, 1100));
        dir = dir === "down" ? "up" : "down";
      }
    })();

    return () => {
      cancelled = true;
    };
    // Only re-run when boundaries change — not on every n update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  return (
    <div className="relative flex h-[110px] w-full items-center gap-3 overflow-hidden">
      <div className="flex-1">
        <div
          className={`text-[9px] font-semibold uppercase tracking-widest ${labelColor}`}
        >
          {label}
        </div>
        <div className={`mt-1 text-3xl font-medium tracking-tight ${valueColor}`}>
          {n}
          <span
            className={`ml-1 text-base ${
              tone === "lime" ? "text-accent-on/65" : "text-white/55"
            }`}
          >
            {unit}
          </span>
        </div>
      </div>
      <svg viewBox="0 0 100 60" className="h-[60px] w-[100px]">
        <motion.path
          d="M2,12 C20,18 35,28 50,32 C70,38 85,44 98,52"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{
            duration: 2.4,
            times: [0, 0.7, 1],
            repeat: Infinity,
            repeatDelay: 1.6,
            ease: "easeOut",
          }}
        />
      </svg>
    </div>
  );
}

// ----------------------------------------------------------------------------
// CaffeineCurve — exponential decay curve animating, with a "bedtime"
// vertical marker that drifts as the curve replays
// ----------------------------------------------------------------------------
export function CaffeineCurve({ tone }: VizProps) {
  const stroke = tone === "lime" ? "#0A0A10" : "#C8FF55";
  const muted = tone === "lime" ? "rgba(10,10,16,0.4)" : "rgba(255,255,255,0.4)";
  const labelColor =
    tone === "lime" ? "text-accent-on/55" : "text-white/45";

  // Decay curve points (mg over hours)
  const path = "M0,12 C20,16 40,28 70,46 C100,58 140,68 180,74 C220,78 260,80 320,82";

  return (
    <div className="relative h-[110px] w-full overflow-hidden">
      <span
        className={`mb-1 block text-[9px] font-semibold uppercase tracking-widest ${labelColor}`}
      >
        Caffeine on board
      </span>
      <svg viewBox="0 0 320 90" className="h-[80px] w-full" preserveAspectRatio="none">
        {/* Bedtime marker line — pulses */}
        <motion.line
          x1="220"
          y1="0"
          x2="220"
          y2="90"
          stroke={muted}
          strokeWidth="1"
          strokeDasharray="3 3"
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Decay curve — draws then resets */}
        <motion.path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{
            duration: 4.5,
            times: [0, 0.55, 0.9, 1],
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        {/* Filled area under the curve, faint */}
        <motion.path
          d={`${path} L320,90 L0,90 Z`}
          fill={stroke}
          opacity={0.12}
          animate={{ opacity: [0, 0.16, 0.16, 0] }}
          transition={{
            duration: 4.5,
            times: [0, 0.55, 0.9, 1],
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        <text x="224" y="14" fontSize="9" fill={muted}>
          bedtime
        </text>
      </svg>
    </div>
  );
}

// ----------------------------------------------------------------------------
// TimezoneClocks — two clock dials, hour hands ticking at different rates
// ----------------------------------------------------------------------------
export function TimezoneClocks({ tone }: VizProps) {
  const stroke = tone === "lime" ? "#0A0A10" : "#C8FF55";
  const muted = tone === "lime" ? "rgba(10,10,16,0.5)" : "rgba(255,255,255,0.5)";
  const dim = tone === "lime" ? "rgba(10,10,16,0.20)" : "rgba(255,255,255,0.15)";
  const labelColor =
    tone === "lime" ? "text-accent-on/55" : "text-white/45";

  return (
    <div className="relative h-[110px] w-full overflow-hidden">
      <span
        className={`mb-1 block text-[9px] font-semibold uppercase tracking-widest ${labelColor}`}
      >
        Time shift
      </span>
      <div className="flex items-center justify-around gap-2 pt-1">
        <ClockDial label="London" stroke={stroke} muted={muted} dim={dim} hourHandFromAngle={130} />
        <motion.span
          className="text-base"
          style={{ color: muted }}
          animate={{ x: [-2, 2, -2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.span>
        <ClockDial label="Seoul" stroke={stroke} muted={muted} dim={dim} hourHandFromAngle={310} />
      </div>
    </div>
  );
}

function ClockDial({
  label,
  stroke,
  muted,
  dim,
  hourHandFromAngle,
}: {
  label: string;
  stroke: string;
  muted: string;
  dim: string;
  hourHandFromAngle: number;
}) {
  // The hour hand sweeps a ~60deg arc back and forth to suggest the
  // passage of time without being a real clock.
  const start = hourHandFromAngle;
  const end = hourHandFromAngle + 60;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="22" stroke={dim} strokeWidth="1" fill="none" />
        {[0, 90, 180, 270].map((a) => {
          const r = 19;
          const cx = 25 + Math.cos((a - 90) * (Math.PI / 180)) * r;
          const cy = 25 + Math.sin((a - 90) * (Math.PI / 180)) * r;
          return <circle key={a} cx={cx} cy={cy} r="1" fill={muted} />;
        })}
        {/* Hour hand sweeping back and forth */}
        <motion.line
          x1="25"
          y1="25"
          x2="25"
          y2="11"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ originX: "25px", originY: "25px" }}
          animate={{ rotate: [start, end, start] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <span className="text-[9px]" style={{ color: muted }}>
        {label}
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// MarkerReveal — list of lab markers appearing one-by-one with arrows
// ----------------------------------------------------------------------------
export function MarkerReveal({ tone }: VizProps) {
  const labelColor =
    tone === "lime" ? "text-accent-on/55" : "text-white/45";
  const baseColor =
    tone === "lime" ? "text-accent-on" : "text-white/85";
  const goodColor = tone === "lime" ? "#0A0A10" : "#C8FF55";
  const badColor = "#F2647D";

  const markers: { name: string; v: string; tone: "good" | "bad" | "neutral" }[] = [
    { name: "LDL", v: "142", tone: "bad" },
    { name: "HDL", v: "58", tone: "good" },
    { name: "HbA1c", v: "5.4", tone: "good" },
    { name: "Vit D", v: "38", tone: "good" },
  ];

  return (
    <div className="relative h-[110px] w-full overflow-hidden">
      <span
        className={`mb-1 block text-[9px] font-semibold uppercase tracking-widest ${labelColor}`}
      >
        Recent labs
      </span>
      <ul className="space-y-1">
        {markers.map((m, i) => (
          <motion.li
            key={i}
            className="flex items-center justify-between text-[12px]"
            initial={{ opacity: 0, y: 4 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [4, 0, 0, 4],
            }}
            transition={{
              duration: 5,
              times: [0, 0.15, 0.85, 1],
              delay: i * 0.32,
              repeat: Infinity,
              repeatDelay: markers.length * 0.32,
              ease: "easeInOut",
            }}
          >
            <span className={`${baseColor}`}>{m.name}</span>
            <span className="flex items-center gap-1.5">
              <span
                className={
                  tone === "lime"
                    ? "text-accent-on/85"
                    : "text-white/70"
                }
              >
                {m.v}
              </span>
              <span
                style={{
                  color:
                    m.tone === "good"
                      ? goodColor
                      : m.tone === "bad"
                        ? badColor
                        : "rgba(255,255,255,0.45)",
                }}
                className="text-[10px] font-bold"
              >
                {m.tone === "good" ? "↑" : m.tone === "bad" ? "↑" : "—"}
              </span>
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
