"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

/**
 * Animates a number counting up from 0 to `to` once the element
 * enters the viewport. Renders inside a <span>; designed to slot
 * into the big stat numbers on the About section.
 *
 * Uses `useMotionValue` so the count animation runs off the main
 * thread where possible — no per-frame React re-renders.
 */
export function CountUp({
  to,
  duration = 1.4,
  suffix = "",
  prefix = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });
  const mv = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration,
      // Strong ease-out — fast at the start, settles slowly. Feels
      // more deliberate than a linear or symmetric ease.
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, to, duration, mv]);

  useEffect(() => {
    const unsubscribe = mv.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(v)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [mv, prefix, suffix]);

  return <span ref={ref}>{`${prefix}0${suffix}`}</span>;
}
