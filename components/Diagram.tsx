"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * The wiring either side of the DAYGO hub, drawn in on scroll: the seven
 * sources connect first, then the hub feeds the three outputs — so the
 * section animates its own claim (data in, guidance out).
 *
 * The reveal is a clip-path wipe rather than a `pathLength` draw. These
 * SVGs stretch with preserveAspectRatio="none", which distorts a stroke
 * dash pattern (computed in un-stretched user units) and leaves the lines
 * stopping short of the hub. A clip wipe is unaffected by that scaling.
 *
 * Endpoints match the `justify-between` spacing of the labels beside them:
 * seven sources over the full height, three outputs over a narrower band.
 */

const FAN_IN_Y = [4, 19.3, 34.7, 50, 65.3, 80.7, 96];
const FAN_OUT_Y = [5, 50, 95];

const HIDDEN = "inset(0 100% 0 0)";
const SHOWN = "inset(0 0% 0 0)";

const FAN_IN_DURATION = 1.1;
/** Outputs start once the inputs have arrived, never alongside them. */
const FAN_OUT_DELAY = FAN_IN_DURATION + 0.15;

function useWipeIn() {
  const ref = useRef<HTMLDivElement>(null);
  // once: the diagram shouldn't redraw every time it scrolls past
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduced = useReducedMotion();
  return { ref, show: reduced || inView, reduced };
}

function Fan({
  className,
  children,
  delay,
  duration,
}: {
  className?: string;
  children: React.ReactNode;
  delay: number;
  duration: number;
}) {
  const { ref, show, reduced } = useWipeIn();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: reduced ? SHOWN : HIDDEN }}
      animate={{ clipPath: show ? SHOWN : HIDDEN }}
      transition={reduced ? { duration: 0 } : { duration, delay, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        {children}
      </svg>
    </motion.div>
  );
}

export function FanIn({ className }: { className?: string }) {
  return (
    <Fan className={className} delay={0} duration={FAN_IN_DURATION}>
      {FAN_IN_Y.map((y) => (
        <path key={y} d={`M0 ${y}H34C58 ${y} 60 50 84 50H100`} vectorEffect="non-scaling-stroke" />
      ))}
    </Fan>
  );
}

export function FanOut({ className }: { className?: string }) {
  return (
    <Fan className={className} delay={FAN_OUT_DELAY} duration={0.8}>
      {FAN_OUT_Y.map((y) => (
        <path key={y} d={`M0 50H16C40 50 42 ${y} 66 ${y}H100`} vectorEffect="non-scaling-stroke" />
      ))}
    </Fan>
  );
}
