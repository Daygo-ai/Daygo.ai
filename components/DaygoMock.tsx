"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Per-card "mocked Daygo iOS UI" components for the Six Moments
 * section. Each one is the visible hero of its card — sized to take
 * 60-70% of the card real estate, animating in place so the page is
 * always alive without being noisy.
 *
 * The point: replace abstract sparklines with mocked-up product UI so
 * the marketing page actually shows the product. Ocoya.com style.
 *
 * Each component is hand-styled for its specific card background
 * color. No `tone` prop — they don't dynamically invert.
 */

// ---------------------------------------------------------------------------
// 01 — ChatMock: animated chat exchange (lime card background)
// ---------------------------------------------------------------------------
type ChatTurn = { role: "user" | "ai"; text: string };

const CHAT_SCRIPT: ChatTurn[] = [
  { role: "user", text: "Should I run today?" },
  { role: "ai", text: "Easy run only. HRV down 12%." },
  { role: "ai", text: "Skip the 8×500m. Swap to Thursday." },
];

export function ChatMock() {
  const [shown, setShown] = useState<ChatTurn[]>([]);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async function loop() {
      while (!cancelled) {
        // Reset
        setShown([]);
        setThinking(false);
        await sleep(700);
        if (cancelled) return;

        // User
        setShown([CHAT_SCRIPT[0]]);
        await sleep(900);
        if (cancelled) return;

        // AI thinking → first reply
        setThinking(true);
        await sleep(900);
        if (cancelled) return;
        setThinking(false);
        setShown((s) => [...s, CHAT_SCRIPT[1]]);
        await sleep(1200);
        if (cancelled) return;

        // AI second reply (no thinking — feels like fast follow-up)
        setShown((s) => [...s, CHAT_SCRIPT[2]]);
        await sleep(2800);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-accent-on/[0.06] p-4 ring-1 ring-accent-on/10">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="block h-6 w-6 rounded-full bg-accent-on" />
          <span className="text-[11px] font-semibold tracking-wide text-accent-on">
            Daygo
          </span>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-widest text-accent-on/55">
          Today · 7:42
        </span>
      </div>

      <div className="min-h-[170px] space-y-2">
        <AnimatePresence initial={false}>
          {shown.map((m, i) => (
            <motion.div
              key={`${m.role}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12.5px] leading-snug ${
                  m.role === "user"
                    ? "bg-accent-on text-accent"
                    : "bg-accent-on/[0.07] text-accent-on ring-1 ring-accent-on/10"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
          {thinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex justify-start"
            >
              <div className="rounded-2xl bg-accent-on/[0.07] px-3 py-2.5 ring-1 ring-accent-on/10">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="block h-1.5 w-1.5 rounded-full bg-accent-on/70"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                      transition={{
                        duration: 1.0,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 02 — IntentMock: weekly intent card with checkmarks animating in
// ---------------------------------------------------------------------------
const INTENT_ITEMS = [
  { text: "In bed by 22:30", checkAt: 1.4 },
  { text: "No caffeine after 1pm", checkAt: 2.3 },
  { text: "4 lifts, 2 runs", checkAt: 3.2 },
];

export function IntentMock() {
  // Single counter tracking the loop progress. Each item checks at
  // its checkAt second; we reset at 6s.
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf: number;
    let start = performance.now();
    function tick(now: number) {
      const elapsed = ((now - start) / 1000) % 6;
      setT(elapsed);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative w-full rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/65">
          This week
        </span>
        <span className="text-[10px] text-white/45">Mon · Day 2</span>
      </div>

      <ul className="space-y-2.5">
        {INTENT_ITEMS.map((it, i) => {
          const checked = t >= it.checkAt && t < 5.5;
          return (
            <li key={i} className="flex items-center gap-3">
              <span className="relative grid h-5 w-5 place-items-center">
                <motion.span
                  initial={false}
                  animate={{
                    scale: checked ? 1 : 0.92,
                    backgroundColor: checked
                      ? "#C8FF55"
                      : "rgba(255,255,255,0.10)",
                    borderColor: checked
                      ? "#C8FF55"
                      : "rgba(255,255,255,0.30)",
                  }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 rounded-md border"
                />
                {checked && (
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    viewBox="0 0 16 16"
                    className="relative h-3 w-3"
                  >
                    <motion.path
                      d="M3 8 L7 12 L13 4"
                      stroke="#0A0A10"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </motion.svg>
                )}
              </span>
              <span
                className={`text-[13px] leading-tight transition-colors ${
                  checked ? "text-white" : "text-white/65"
                }`}
              >
                {it.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 03 — CompareMock: two-side biomarker compare with declining line
// ---------------------------------------------------------------------------
export function CompareMock() {
  // Always counts down 142 → 124 then resets and counts down again.
  // Never goes up — the card is supposed to feel like a steady win.
  const [n, setN] = useState(142);

  useEffect(() => {
    let cancelled = false;
    const tick = (from: number, to: number, ms: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        function step(t: number) {
          if (cancelled) return resolve();
          const p = Math.min(1, (t - start) / ms);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(from + (to - from) * eased));
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      });

    (async function loop() {
      while (!cancelled) {
        // Snap back to 142 (instant), pause, then animate down to 124.
        setN(142);
        await new Promise((r) => setTimeout(r, 700));
        if (cancelled) return;
        await tick(142, 124, 1800);
        // Hold on the final value so people can read it.
        await new Promise((r) => setTimeout(r, 2400));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const startN = 142;
  const isDown = n < startN;

  return (
    <div className="relative w-full rounded-2xl bg-black/[0.04] p-4 ring-1 ring-black/[0.08]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-black/55">
          LDL · mg/dL
        </span>
        <span className="text-[10px] text-black/40">2024 → 2025</span>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-2 pt-1">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-black/45">
            Then
          </div>
          <div className="mt-0.5 text-3xl font-medium tracking-tight text-black/85">
            {startN}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-black/45">
            Now
          </div>
          <div className="mt-0.5 flex items-baseline justify-end gap-1">
            <span className="text-3xl font-medium tracking-tight text-black">
              {n}
            </span>
            <span
              className={`text-sm font-semibold ${
                isDown ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {isDown ? "↓" : "↑"}
            </span>
          </div>
        </div>
      </div>

      <svg viewBox="0 0 200 50" className="h-[40px] w-full">
        <motion.path
          d="M0,12 C45,15 80,28 120,38 C150,44 175,46 200,42"
          fill="none"
          stroke="#0A0A10"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{
            duration: 1.8,
            times: [0, 0.85, 1],
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeOut",
          }}
        />
        <motion.circle
          cx="200"
          cy="42"
          r="3"
          fill="#0A0A10"
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{
            duration: 3.3,
            times: [0, 0.5, 0.55, 0.95, 1],
            repeat: Infinity,
          }}
        />
      </svg>
      <div className="mt-1 text-[11px] font-medium text-emerald-700">
        −18 over six months
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 04 — CaffeineMock: today warning card
// ---------------------------------------------------------------------------
export function CaffeineMock() {
  return (
    <div className="relative w-full rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/55">
          21:04 · Caffeine
        </span>
        <motion.span
          className="block h-1.5 w-1.5 rounded-full bg-rose-400"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </div>

      <div className="flex items-end gap-3">
        <div className="text-4xl font-medium tracking-tight text-white">
          87
          <span className="ml-1 text-base text-white/55">mg</span>
        </div>
        <div className="pb-1.5 text-[11px] text-white/55">at bedtime</div>
      </div>

      <svg viewBox="0 0 200 50" className="mt-2 h-[40px] w-full">
        {/* Filled decay area */}
        <motion.path
          d="M0,8 C30,12 60,22 100,32 C140,40 170,44 200,46 L200,50 L0,50 Z"
          fill="#C8FF55"
          opacity="0.18"
          animate={{ opacity: [0, 0.18, 0.18, 0] }}
          transition={{
            duration: 4,
            times: [0, 0.4, 0.85, 1],
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        {/* Curve stroke */}
        <motion.path
          d="M0,8 C30,12 60,22 100,32 C140,40 170,44 200,46"
          fill="none"
          stroke="#C8FF55"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{
            duration: 4,
            times: [0, 0.4, 0.85, 1],
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        {/* Bedtime marker */}
        <motion.line
          x1="155"
          y1="0"
          x2="155"
          y2="50"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
          strokeDasharray="2 2"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <text x="158" y="10" fontSize="8" fill="rgba(255,255,255,0.45)">
          22:30
        </text>
      </svg>

      <div className="mt-2.5 flex items-center gap-2">
        <button
          type="button"
          className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black"
        >
          Skip
        </button>
        <span className="text-[11px] text-white/55">
          safe sleep · 06:38
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 05 — TravelMock: timezone shift card
// ---------------------------------------------------------------------------
export function TravelMock() {
  return (
    <div className="relative w-full rounded-2xl bg-black/15 p-4 ring-1 ring-white/10">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/65">
          Travel
        </span>
        <motion.span
          className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white"
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          +8h
        </motion.span>
      </div>

      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-base text-white/55">London</span>
        <motion.span
          className="text-base text-white/45"
          animate={{ x: [-2, 2, -2] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          →
        </motion.span>
        <span className="text-xl font-medium text-white">Seoul</span>
      </div>

      <div className="space-y-1.5">
        <Row label="Bedtime" value="14:00 KST" />
        <Row label="Morning sun" value="07:00–08:30" />
        <Row label="Recovery" value="36 hrs" muted />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-white/55">{label}</span>
      <span className={muted ? "text-white/55" : "text-white"}>{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HeroTodayCard: large mocked "Today's plan" card for the hero. Lime
// background, three rows revealing one by one (sleep / training /
// caffeine), based on real signals shown in a small footer.
// ---------------------------------------------------------------------------
const TODAY_ROWS = [
  { icon: "run", label: "Easy 30 min run", sub: "max HR 148" },
  { icon: "bed", label: "In bed by 22:30", sub: "you said 7h+" },
  { icon: "coffee", label: "Last coffee · 13:00", sub: "87mg projected" },
];

export function HeroTodayCard() {
  // Each row reveals after a delay, then they all hold, then reset.
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      // 8s loop — reveal 0→2.4s, hold 2.4→7s, fade-prep 7→8s.
      const elapsed = ((now - start) / 1000) % 8;
      setT(elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative w-full rounded-[28px] bg-accent p-5 text-accent-on shadow-2xl shadow-black/40 ring-1 ring-accent-on/10 md:p-7">
      {/* Header strip — looks like the Daygo today screen */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-on">
            <span className="block h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-[13px] font-semibold tracking-tight text-accent-on">
            Daygo
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-on/55">
          Tue · May 6
        </span>
      </div>

      {/* Big headline */}
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-on/55">
        Today
      </div>
      <div className="mb-5 text-[28px] font-semibold leading-tight tracking-tight text-accent-on md:text-[32px]">
        Easy day. Protect Thursday.
      </div>

      {/* Reveal rows */}
      <div className="space-y-2.5">
        {TODAY_ROWS.map((row, i) => {
          const showAt = 0.5 + i * 0.65;
          const visible = t >= showAt && t < 7.5;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                opacity: visible ? 1 : 0,
                x: visible ? 0 : -10,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-3 rounded-2xl bg-accent-on/[0.06] px-3.5 py-2.5 ring-1 ring-accent-on/10"
            >
              <RowIcon kind={row.icon as "run" | "bed" | "coffee"} />
              <div className="flex-1 leading-tight">
                <div className="text-[13.5px] font-semibold text-accent-on">
                  {row.label}
                </div>
                <div className="text-[11px] text-accent-on/55">
                  {row.sub}
                </div>
              </div>
              <span className="text-[11px] font-semibold tracking-wide text-accent-on/65">
                ✓
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer — the "based on" line that signals real reasoning */}
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-accent-on/65">
        <span className="font-semibold uppercase tracking-[0.16em] text-accent-on/45">
          Why
        </span>
        <span>HRV ↓12%</span>
        <span className="text-accent-on/30">·</span>
        <span>sleep 6h 50m</span>
        <span className="text-accent-on/30">·</span>
        <span>RHR +4 bpm</span>
      </div>
    </div>
  );
}

function RowIcon({ kind }: { kind: "run" | "bed" | "coffee" }) {
  // Tiny line-art glyphs in dark on the lime card, drawn inline so we
  // don't pull in an icon library for three glyphs.
  const common = "h-4 w-4";
  if (kind === "run") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <circle cx="14" cy="5" r="2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M9 12l3-3 3 2 3-1M5 21l4-7 3 2v5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "bed") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <path
          d="M3 18v-6h18v6M3 12V8h7v4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 9h12v6a4 4 0 01-4 4H9a4 4 0 01-4-4V9zM17 11h2a2 2 0 010 4h-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 4v2M12 3v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 06 — LabScanMock: marquee of biomarker chips, full-width card
// ---------------------------------------------------------------------------
const MARKERS: { name: string; v: string; status: "good" | "bad" | "watch" }[] = [
  { name: "LDL", v: "142", status: "bad" },
  { name: "HDL", v: "58", status: "good" },
  { name: "HbA1c", v: "5.4", status: "good" },
  { name: "Vit D", v: "38", status: "good" },
  { name: "Ferritin", v: "92", status: "good" },
  { name: "TSH", v: "1.8", status: "good" },
  { name: "ALT", v: "29", status: "good" },
  { name: "AST", v: "24", status: "good" },
  { name: "Glucose", v: "98", status: "good" },
  { name: "Mg", v: "1.7", status: "watch" },
  { name: "Na", v: "139", status: "good" },
  { name: "K", v: "4.1", status: "good" },
  { name: "Cr", v: "0.9", status: "good" },
  { name: "ApoB", v: "108", status: "bad" },
];

export function LabScanMock() {
  // Two copies in a row, animate the wrapper x to -50% so it loops
  // seamlessly. CSS-only would work too but framer is consistent.
  const dup = [...MARKERS, ...MARKERS];
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/[0.08]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/55">
          Quest results · 14 markers
        </span>
        <span className="text-[10px] text-white/35">scanned 4.1s</span>
      </div>
      <motion.div
        className="flex gap-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {dup.map((m, i) => (
          <Chip key={i} {...m} />
        ))}
      </motion.div>
    </div>
  );
}

function Chip({
  name,
  v,
  status,
}: {
  name: string;
  v: string;
  status: "good" | "bad" | "watch";
}) {
  const ringColor =
    status === "good"
      ? "ring-emerald-400/30"
      : status === "bad"
        ? "ring-rose-400/40"
        : "ring-amber-300/40";
  const dot =
    status === "good"
      ? "bg-emerald-400"
      : status === "bad"
        ? "bg-rose-400"
        : "bg-amber-300";
  return (
    <div
      className={`flex shrink-0 items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1.5 ring-1 ${ringColor}`}
    >
      <span className={`block h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="text-[12px] font-medium text-white/85">{name}</span>
      <span className="text-[12px] text-white/55">{v}</span>
    </div>
  );
}
