"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * The four live mini-charts under the feature grid. Each is a small
 * looping animation in the same spirit as MomentViz on the main site:
 * running continuously, but only while on screen.
 *
 * All four share a 120x40 viewBox and are stretched by the parent, so
 * they stay visually consistent across columns.
 */

type ChartProps = { className?: string };

/** Pauses the loop while off screen, and honours reduced-motion. */
function useChartMotion() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  return { ref, animated: inView && !reduced };
}

/* ------------------------------- Sleep -------------------------------- */
// A hypnogram — the stage trace of one night. Deep sleep dominates early,
// REM periods lengthen toward morning, and it ends on a wake. The night
// sweeps in from the left, holds so it can be read, then sweeps out.

const STAGE = { awake: 4, rem: 12, light: 22, deep: 34 };

const HYPNOGRAM = [
  `M0 ${STAGE.awake}`,
  `H6 V${STAGE.light}`,
  `H16 V${STAGE.deep}`,
  `H30 V${STAGE.light}`,
  `H36 V${STAGE.rem}`,
  `H44 V${STAGE.light}`,
  `H52 V${STAGE.deep}`,
  `H62 V${STAGE.light}`,
  `H70 V${STAGE.rem}`,
  `H80 V${STAGE.light}`,
  `H88 V${STAGE.deep}`,
  `H94 V${STAGE.light}`,
  `H102 V${STAGE.rem}`,
  `H112 V${STAGE.awake}`,
  "H120",
].join(" ");

// Wipes in from the left, holds, then wipes off to the left. Both ends of
// the loop are fully-hidden states, so the repeat has no visible jump.
const SWEEP_IN = "inset(0 100% 0 0)";
const SWEEP_SHOWN = "inset(0 0% 0 0)";
const SWEEP_OUT = "inset(0 0 0 100%)";

export function SleepChart({ className }: ChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const animated = inView && !reduced;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: reduced ? SWEEP_SHOWN : SWEEP_IN }}
      animate={
        animated
          ? { clipPath: [SWEEP_IN, SWEEP_SHOWN, SWEEP_SHOWN, SWEEP_OUT] }
          : { clipPath: SWEEP_SHOWN }
      }
      transition={
        animated
          ? { duration: 4.2, times: [0, 0.45, 0.72, 1], repeat: Infinity, ease: "easeInOut" }
          : { duration: 0 }
      }
    >
      <svg viewBox="0 0 120 40" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
        <path
          d={HYPNOGRAM}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.div>
  );
}

/* ------------------------------ Training ------------------------------ */
// A stick runner, in place. Joint positions are derived from joint angles
// rather than hand-placed, so the limbs stay the right length through the
// cycle. Four poses (contact, mid-stance, toe-off, recovery) looping back
// to the first, with arms a half-cycle out of phase with the legs.

const HIP = { x: 30, y: 44 };
const SHOULDER = { x: 30, y: 24 };
const THIGH = 14;
const SHIN = 13;
const UPPER_ARM = 10;
const FOREARM = 9;

/** Angles are degrees from straight-down; positive swings forward (+x). */
const rad = (deg: number) => (deg * Math.PI) / 180;

function limbPath(
  origin: { x: number; y: number },
  angleA: number,
  lenA: number,
  angleB: number,
  lenB: number,
) {
  const joint = {
    x: origin.x + lenA * Math.sin(rad(angleA)),
    y: origin.y + lenA * Math.cos(rad(angleA)),
  };
  const end = {
    x: joint.x + lenB * Math.sin(rad(angleB)),
    y: joint.y + lenB * Math.cos(rad(angleB)),
  };
  return `M${origin.x} ${origin.y} L${joint.x.toFixed(2)} ${joint.y.toFixed(2)} L${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

// [thigh, shin] and [upper arm, forearm] for each of the four poses
const LEG_POSES: [number, number][] = [
  [28, 3], // contact — leg reaching forward
  [0, -10], // mid-stance — under the body
  [-30, -65], // toe-off — trailing, heel kicking up
  [5, -85], // recovery — knee up, heel tucked
];
const ARM_POSES: [number, number][] = [
  [-35, 50], // back
  [-5, 80], // passing
  [30, 115], // forward
  [-5, 80], // passing
];

const legPath = (i: number) => limbPath(HIP, LEG_POSES[i][0], THIGH, LEG_POSES[i][1], SHIN);
const armPath = (i: number) => limbPath(SHOULDER, ARM_POSES[i][0], UPPER_ARM, ARM_POSES[i][1], FOREARM);

// near side runs 0→3; far side is half a cycle ahead. Last frame repeats
// the first so the loop closes seamlessly.
const NEAR = [0, 1, 2, 3, 0];
const FAR = [2, 3, 0, 1, 2];

const CYCLE = { duration: 0.8, repeat: Infinity, ease: "linear" as const };

export function RunnerChart({ className }: ChartProps) {
  const { ref, animated } = useChartMotion();

  const frames = (seq: number[], build: (i: number) => string) => seq.map(build);

  return (
    <svg ref={ref} viewBox="0 0 60 80" className={className} aria-hidden>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        <motion.g
          // torso dips at each foot contact — twice per full cycle
          animate={animated ? { y: [1.4, 0, 1.4, 0, 1.4] } : { y: 0 }}
          transition={CYCLE}
        >
          {/* far limbs sit behind, recessive so the near side stays readable */}
          <g opacity={0.4}>
            <motion.path
              animate={animated ? { d: frames(FAR, armPath) } : { d: armPath(FAR[0]) }}
              transition={CYCLE}
              d={armPath(FAR[0])}
            />
            <motion.path
              animate={animated ? { d: frames(FAR, legPath) } : { d: legPath(FAR[0]) }}
              transition={CYCLE}
              d={legPath(FAR[0])}
            />
          </g>

          <circle cx={30} cy={12} r={6} />
          <path d={`M30 18 L${HIP.x} ${HIP.y}`} />

          <motion.path
            animate={animated ? { d: frames(NEAR, armPath) } : { d: armPath(NEAR[0]) }}
            transition={CYCLE}
            d={armPath(NEAR[0])}
          />
          <motion.path
            animate={animated ? { d: frames(NEAR, legPath) } : { d: legPath(NEAR[0]) }}
            transition={CYCLE}
            d={legPath(NEAR[0])}
          />
        </motion.g>
      </g>
    </svg>
  );
}

/* --------------------------- LDL then → now --------------------------- */
// Counts 142 down to 124 while the trend line draws, holds so it's
// readable, then resets. It only ever goes down — the card is meant to
// read as a steady win. Same timing as CompareMock on the main site.

const LDL_FROM = 142;
const LDL_TO = 124;

export function LdlCompare({ className }: ChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const animated = inView && !reduced;

  const [n, setN] = useState(reduced ? LDL_TO : LDL_FROM);

  useEffect(() => {
    if (!animated) {
      setN(LDL_TO);
      return;
    }
    let cancelled = false;

    const countDown = (ms: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const step = (t: number) => {
          if (cancelled) return resolve();
          const p = Math.min(1, (t - start) / ms);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(LDL_FROM + (LDL_TO - LDL_FROM) * eased));
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

    (async () => {
      while (!cancelled) {
        setN(LDL_FROM);
        await new Promise((r) => setTimeout(r, 700));
        if (cancelled) return;
        await countDown(1800);
        await new Promise((r) => setTimeout(r, 2400));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [animated]);

  return (
    <div ref={wrapRef} className={className}>
      <div className="flex items-baseline justify-between font-mono text-[9px] uppercase tracking-widest opacity-60">
        <span>LDL · mg/dL</span>
        <span>2024 → 2025</span>
      </div>

      <div className="mt-3 flex items-end justify-between text-black">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest opacity-50">Then</div>
          <div className="text-2xl font-black tracking-tighter tabular-nums">{LDL_FROM}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[9px] uppercase tracking-widest opacity-50">Now</div>
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-2xl font-black tracking-tighter tabular-nums">{n}</span>
            <span className="text-sm font-bold opacity-55">↓</span>
          </div>
        </div>
      </div>

      <svg viewBox="0 0 200 50" className="mt-2 h-8 w-full" preserveAspectRatio="none" aria-hidden>
        <motion.path
          d="M4,12 C45,15 80,28 120,38 C150,44 175,46 196,42"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: animated ? 0 : 1 }}
          animate={animated ? { pathLength: [0, 1, 1] } : { pathLength: 1 }}
          transition={{ duration: 1.8, times: [0, 0.85, 1], repeat: Infinity, repeatDelay: 1.5, ease: "easeOut" }}
        />
      </svg>

      <p className="mt-1 font-mono text-[9px] uppercase tracking-widest opacity-60">
        −{LDL_FROM - LDL_TO} over six months
      </p>
    </div>
  );
}

/* --------------------------- Memory recall ---------------------------- */
// A question, then a symptom the user mentioned months ago surfacing,
// then an answer that leans on it. Deliberately a self-reported symptom
// rather than synced data — recalling logged sleep is not memory.

const RECALL_STEPS = 3;

export function MemoryRecall({ className }: ChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const animated = inView && !reduced;

  const [shown, setShown] = useState(reduced ? RECALL_STEPS : 0);

  useEffect(() => {
    if (!animated) {
      setShown(RECALL_STEPS);
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      if (cancelled) return;
      setShown(0);
      timers.push(setTimeout(() => !cancelled && setShown(1), 400));
      timers.push(setTimeout(() => !cancelled && setShown(2), 1600));
      timers.push(setTimeout(() => !cancelled && setShown(3), 2700));
      timers.push(setTimeout(run, 7000));
    };
    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [animated]);

  const step = (i: number) => ({
    initial: { opacity: 0, y: 6 },
    animate: shown > i ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
    transition: { duration: 0.45, ease: "easeOut" as const },
  });

  return (
    <div ref={ref} className={className}>
      {/* the question */}
      <motion.div className="flex justify-end" {...step(0)}>
        <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-medium text-white">
          Knee&apos;s sore again.
        </span>
      </motion.div>

      {/* something the user mentioned once, months ago — not synced data */}
      <motion.div className="mt-2 flex items-center gap-1.5" {...step(1)}>
        <span className="text-[10px] leading-none">↺</span>
        <span className="whitespace-nowrap border border-current/30 px-1.5 py-1 font-mono text-[8.5px] uppercase tracking-wider">
          Recalled · knee, Mar 12
        </span>
      </motion.div>

      {/* the answer that only works because it remembered */}
      <motion.p className="mt-2 text-[11px] leading-snug text-black" {...step(2)}>
        Third flare-up — each one followed a hill session.
      </motion.p>
    </div>
  );
}
