"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LIME } from "@/lib/brand";

/**
 * The hero headline, staggered in on load: four lines rise in sequence and
 * the lime loop lands last, so it reads as being drawn around "CLEARER"
 * rather than arriving with it. One deliberate moment, then the page settles.
 */

const RISE = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0 },
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroHeadline() {
  const reduced = useReducedMotion();

  // With reduced motion the whole thing renders in place, no transitions.
  const anim = reduced
    ? {}
    : { initial: "hidden" as const, animate: "shown" as const, variants: RISE };

  const line = (i: number) => ({
    ...anim,
    transition: { duration: 0.65, ease: EASE, delay: i * 0.09 },
  });

  return (
    <h1 className="text-[14vw] font-black uppercase leading-[0.82] tracking-tighter sm:text-[9vw] md:text-[5.4rem]">
      <motion.span className="block" {...line(0)}>
        Turn
      </motion.span>
      <motion.span className="block" {...line(1)}>
        Your Data
      </motion.span>
      <motion.span className="block" {...line(2)}>
        Into{" "}
        <span className="relative inline-block" style={{ color: LIME }}>
          <span className="relative z-10">A</span>
        </span>
      </motion.span>

      <motion.span className="relative block w-fit" style={{ color: LIME }} {...line(3)}>
        <span className="relative z-10">Clearer</span>
        {/* Positioning lives on a plain span: motion writes its own transform,
            which would otherwise clobber the -translate centring. */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 z-0 h-[195%] w-[132%] -translate-x-1/2 -translate-y-1/2"
        >
          <motion.span
            className="block h-full w-full"
            initial={reduced ? undefined : { opacity: 0, scale: 0.72, rotate: -14 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.62 }}
          >
            <Image
              src="/redesign/loop.webp"
              alt=""
              width={2170}
              height={725}
              sizes="60vw"
              priority
              className="pointer-events-none h-full w-full max-w-none -rotate-2 select-none"
            />
          </motion.span>
        </span>
      </motion.span>

      <motion.span className="block" {...line(4)}>
        Today
      </motion.span>
    </h1>
  );
}
