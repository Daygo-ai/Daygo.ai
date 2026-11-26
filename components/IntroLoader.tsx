"use client";

import { useEffect, useRef, useState } from "react";
import { Bodoni_Moda } from "next/font/google";
import { BONE, LIME } from "@/lib/brand";
import { useLang } from "@/lib/useLang";

const bodoni = Bodoni_Moda({ subsets: ["latin", "latin-ext"], weight: ["500"], style: ["normal"] });

const KEY = "daygo-intro";
const MIN_MS = 1500; // the count always takes at least this long
const MAX_MS = 3000; // and never longer than this, loaded or not

declare global {
  interface Window {
    __daygoIntroDone?: boolean;
  }
}

/** Marks the intro as finished and tells the hero it can start its own animation. */
function finish() {
  window.__daygoIntroDone = true;
  window.dispatchEvent(new Event("daygo:intro-done"));
}

/**
 * Bone-coloured cover with a counter running 000 → 100, shown once per visit on
 * the home page. The page renders underneath the whole time; the cover only
 * hides it. Skipped on repeat views in the same session and for reduced motion.
 */
export function IntroLoader() {
  const tagline = useLang() === "lt" ? "Jūsų sveikata tarp vizitų" : "Your health, between visits";
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // once per visit: a refresh or a return to the home page in the same tab skips it
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
      sessionStorage.setItem(KEY, "1");
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      finish();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);

    const start = performance.now();
    let raf = 0;
    let shown = 0;
    const tick = (now: number) => {
      const t = now - start;
      // ease toward 100 over MIN_MS; hold at 90 until the page has loaded (or MAX_MS passes)
      const timeP = 1 - Math.pow(1 - Math.min(1, t / MIN_MS), 3);
      const cap = loaded || t > MAX_MS ? 100 : 90;
      const target = Math.min(cap, timeP * 100);
      shown = Math.max(shown, target);
      const v = Math.floor(shown);
      setN(v);
      if (bar.current) bar.current.style.transform = `scaleX(${shown / 100})`;
      if (v >= 100) {
        setTimeout(() => {
          setLeaving(true);
          document.documentElement.style.overflow = "";
          finish();
          setTimeout(() => setGone(true), 900);
        }, 250);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    // suppressHydrationWarning: the inline script below may hide this element
    // before React hydrates (repeat visit / reduced motion), which is intended
    <div
      aria-hidden
      suppressHydrationWarning
      className="intro-loader fixed inset-0 z-[100] flex flex-col justify-between px-6 pb-8 pt-6 text-[#141412] md:px-10 md:pb-10"
      style={{
        background: BONE,
        transform: leaving ? "translateY(-100%)" : "none",
        transition: "transform .9s cubic-bezier(.76,0,.24,1)",
      }}
    >
      <div className="flex items-center justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/daygo-wordmark.webp" alt="" className="h-[18px] w-auto invert" />
        <span className="text-[10.5px] font-semibold uppercase tracking-[.2em] text-black/50">{tagline}</span>
      </div>

      <div>
        <div className="flex items-end justify-between gap-6">
          <span className={`${bodoni.className} text-[34vw] leading-[.78] tabular-nums md:text-[22vw]`}>
            {String(n).padStart(3, "0")}
          </span>
          <span className="mb-3 hidden text-[10.5px] font-semibold uppercase tracking-[.2em] text-black/50 md:block">
            Loading your day
          </span>
        </div>
        <div className="mt-6 h-[2px] w-full bg-black/10">
          <div ref={bar} className="h-full w-full origin-left" style={{ background: LIME, transform: "scaleX(0)" }} />
        </div>
      </div>

      {/* fallbacks: hide straight away on a repeat visit, and never trap the page if scripts fail */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("${KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.currentScript.parentElement.style.display="none"}catch(e){}`,
        }}
      />
      <style>{`.intro-loader{animation:intro-failsafe 0s linear 6s forwards}@keyframes intro-failsafe{to{visibility:hidden}}`}</style>
    </div>
  );
}
