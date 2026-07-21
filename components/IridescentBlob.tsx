"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Iridescent gradient blob — floats around the page as the visual
 * counterweight to the bold type. Pure CSS: a conic gradient on an
 * organic blob shape, blurred to look glassy and refractive. Slowly
 * rotates so the page never feels static.
 *
 * Optional `parallax` prop ties vertical movement to scroll position:
 *   parallax = -1 → slowest drift, blob lags behind scroll
 *   parallax =  0 → no parallax (default)
 *   parallax =  1 → drifts upward faster than scroll
 *
 * Sized + positioned by the parent via className. Pointer events
 * disabled so it never blocks clicks.
 */
export function IridescentBlob({
  className,
  duration = 24,
  parallax = 0,
}: {
  className?: string;
  duration?: number;
  parallax?: number;
}) {
  const { scrollY } = useScroll();
  // Map a 4000px scroll range to up to ~300px of vertical drift,
  // scaled by the parallax strength. Keeps motion subtle.
  const y = useTransform(scrollY, [0, 4000], [0, parallax * 300]);

  return (
    <motion.div
      className={`pointer-events-none ${className ?? ""}`}
      style={{ y }}
    >
      <div
        className="h-full w-full"
        style={{
          // Radial, fading to fully transparent at the edge — an opaque
          // blob shape blurred on top just reads as a solid khaki-green
          // stain with a visible edge, not a glow. Fading the color out
          // radially is what actually looks like ambient light.
          background: `radial-gradient(
            circle at 50% 50%,
            rgba(205, 238, 60, 0.55) 0%,
            rgba(168, 200, 32, 0.30) 35%,
            rgba(205, 238, 60, 0.12) 60%,
            transparent 80%
          )`,
          filter: "blur(20px)",
          animation: `iridescent-rotate ${duration}s linear infinite`,
        }}
      />
      <style>{`
        @keyframes iridescent-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}

/**
 * A solid (non-blurred) iridescent shape with chromatic-aberration
 * highlights — used in the hero as the "object" the type wraps
 * around. Distinct from `IridescentBlob` which is a soft glow.
 *
 * Same parallax prop as IridescentBlob — defaults to a gentle
 * upward drift since this object is usually anchored to the hero
 * and benefits from feeling like it floats.
 */
export function IridescentObject({
  className,
  parallax = -0.4,
}: {
  className?: string;
  parallax?: number;
}) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 4000], [0, parallax * 300]);

  return (
    <motion.div
      className={`pointer-events-none ${className ?? ""}`}
      style={{ y }}
    >
      <div
        className="relative h-full w-full"
        style={{
          borderRadius: "42% 58% 38% 62% / 55% 42% 58% 45%",
          background: `
            radial-gradient(at 30% 30%, rgba(255, 255, 255, 0.5), transparent 35%),
            conic-gradient(
              from 200deg at 50% 50%,
              #CDEE3C 0%,
              #EEFF88 25%,
              #A8C820 50%,
              #8AB800 75%,
              #CDEE3C 100%
            )
          `,
          boxShadow:
            "inset 0 0 80px rgba(255,255,255,0.25), 0 30px 80px rgba(205,238,60,0.35), 0 -10px 60px rgba(205,238,60,0.18)",
          animation: "iridescent-rotate 18s linear infinite",
        }}
      />
    </motion.div>
  );
}
