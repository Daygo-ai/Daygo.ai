"use client";

import { useEffect, useRef, useState } from "react";

// Small motion pieces for the marketing site, written in plain React/DOM to
// match the rest of the site (no animation library). Behaviour modelled on the
// Annnimate starter pack: elastic-divider, rotating-words, text-reveal, accordion.

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------------ */
/* Elastic divider: a hairline that springs like a plucked string when the   */
/* cursor sweeps across it, harder the faster you move.                      */
/* ------------------------------------------------------------------------ */
export function ElasticDivider({ color = "rgba(20,20,18,.22)", className = "" }: { color?: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = box.current;
    const p = path.current;
    if (!el || !p) return;
    const MAX = 38; // px of swing at most
    const FREQ = 2.6; // rings per second
    const TAU = 0.32; // decay time (s)
    let w = 0;
    let mid = 0;
    let x = 0;
    let amp = 0;
    let t0 = 0;
    let raf = 0;
    let last: { x: number; y: number; t: number } | null = null;

    const draw = (y: number) => p.setAttribute("d", `M0,${mid} Q${x.toFixed(1)},${(mid + y * 2).toFixed(2)} ${w},${mid}`);
    const measure = () => {
      w = el.clientWidth;
      mid = Math.round(el.clientHeight / 2) + 0.5;
      el.querySelector("svg")?.setAttribute("viewBox", `0 0 ${w} ${el.clientHeight}`);
      x = x || w / 2;
      draw(0);
    };
    const ring = (now: number) => {
      const t = (now - t0) / 1000;
      // quick pull away, then a damped elastic ring back to rest
      const attack = Math.min(1, t / 0.09);
      const y = amp * attack * Math.exp(-t / TAU) * Math.cos(2 * Math.PI * FREQ * Math.max(0, t - 0.09));
      draw(y);
      if (t < TAU * 4.5) raf = requestAnimationFrame(ring);
      else draw(0);
    };
    const flick = (px: number, strength: number, dir: number) => {
      x = Math.max(w * 0.12, Math.min(w * 0.88, px));
      amp = Math.min(MAX, Math.max(3, strength)) * (reduced() ? 0.4 : 1) * dir;
      t0 = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(ring);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top - r.height / 2;
      const now = performance.now();
      if (last && Math.sign(py) !== Math.sign(last.y) && py !== 0) {
        const dt = Math.max(0.004, (now - last.t) / 1000);
        const speed = Math.hypot(px - last.x, py - last.y) / dt;
        flick(px, speed * 0.014, py > 0 ? 1 : -1);
      }
      last = { x: px, y: py, t: now };
    };
    const onLeave = () => (last = null);

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={box} aria-hidden className={`relative h-16 w-full ${className}`}>
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <path ref={path} fill="none" stroke={color} strokeWidth={1} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Rotating words: words on a turning drum; the one in front is solid, the   */
/* ones above and below fade away. Advances on a timer.                      */
/* ------------------------------------------------------------------------ */
export function RotatingWords({ words, interval = 2200, className = "" }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced()) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className={`relative inline-grid justify-items-start align-bottom ${className}`} style={{ perspective: "600px" }}>
      <span className="sr-only">{words[i]}</span>
      {words.map((w, k) => {
        let d = k - i;
        if (d > words.length / 2) d -= words.length;
        if (d < -words.length / 2) d += words.length;
        const near = Math.max(0, 1 - Math.abs(d));
        return (
          <span
            key={w}
            aria-hidden
            className="col-start-1 row-start-1 whitespace-nowrap"
            style={{
              // pivot sits behind the text, so the front word is at its natural size and position
              transform: `rotateX(${-d * 72}deg)`,
              transformOrigin: "50% 50% -0.55em",
              opacity: near, // only the front word shows; neighbours appear only mid-turn
              transition: "transform .9s cubic-bezier(.65,0,.15,1), opacity .9s",
              backfaceVisibility: "hidden",
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Text reveal on scroll: words brighten one after another as the paragraph  */
/* moves up the screen.                                                      */
/* ------------------------------------------------------------------------ */
export function ScrollWords({ text, className = "", style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
    if (reduced()) {
      spans.forEach((s) => (s.style.opacity = "1"));
      return;
    }
    let raf = 0;
    const paint = () => {
      raf = 0;
      // driven by the enclosing section, so it keeps going while a pinned section holds:
      // starts as the section's top passes 60% of the screen, finishes as the section ends
      const sec = (el.closest("section") as HTMLElement) || el;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const run = Math.max(vh * 0.4, vh * 0.6 + r.height - vh);
      const p = Math.max(0, Math.min(1, (vh * 0.6 - r.top) / run));
      const lit = p * spans.length;
      spans.forEach((s, k) => (s.style.opacity = String(0.16 + 0.84 * Math.max(0, Math.min(1, lit - k)))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((w, k) => (
        <span key={k} data-w className="transition-opacity duration-200" style={{ opacity: 0.16 }}>
          {w}
          {k < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------------ */
/* Accordion: one row open at a time; height eases open, the plus turns into */
/* a cross, and the answer's lines rise in after it.                         */
/* ------------------------------------------------------------------------ */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-black/10">
      {items.map((f, i) => {
        const on = open === i;
        return (
          <div key={f.q} className="border-b border-black/10">
            <button
              type="button"
              aria-expanded={on}
              aria-controls={`faq-a-${i}`}
              onClick={() => setOpen(on ? null : i)}
              className="grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-6 text-left md:grid-cols-[3rem_1fr_auto] md:gap-8"
            >
              <span className="font-mono text-[10px] tracking-widest text-black/35">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[17px] font-bold leading-snug md:text-[19px]">{f.q}</span>
              <span
                aria-hidden
                className="relative h-4 w-4 shrink-0 transition-transform duration-500"
                style={{ transform: on ? "rotate(45deg)" : "none", transitionTimingFunction: "cubic-bezier(.87,0,.13,1)" }}
              >
                <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-black" />
                <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-black" />
              </span>
            </button>
            <div
              id={`faq-a-${i}`}
              role="region"
              className="grid transition-[grid-template-rows] duration-500"
              style={{ gridTemplateRows: on ? "1fr" : "0fr", transitionTimingFunction: "cubic-bezier(.87,0,.13,1)" }}
            >
              <div className="overflow-hidden">
                <p
                  className="pb-7 pl-[calc(2.5rem+0.75rem)] pr-8 text-[15px] leading-relaxed text-black/65 transition-all duration-500 md:pl-[calc(3rem+2rem)] md:max-w-3xl"
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? "none" : "translateY(40%)",
                    transitionDelay: on ? ".12s" : "0s",
                    transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
