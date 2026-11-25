"use client";

import { useEffect } from "react";

/**
 * Scene motion for the home page: every `data-scene` element rises, scales up
 * slightly and comes into full opacity as it reaches the middle of the screen,
 * and dims a little as it leaves.
 */
export function SceneMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const shown = new Map<HTMLElement, number>();
    const target = new Map<HTMLElement, number>();
    const side = new Map<HTMLElement, number>();
    let raf = 0;

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const measure = () => {
      const vh = window.innerHeight;
      for (const el of scenes) {
        const r = el.getBoundingClientRect();
        // how much of the element (or of the screen, for tall ones) is on screen
        const overlap = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        const v = Math.min(1, overlap / (Math.min(r.height, vh) * 0.7));
        // below the middle it rises into place; above the middle it drifts up as it leaves
        target.set(el, v);
        side.set(el, r.top + r.height / 2 > vh / 2 ? 1 : -1);
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      raf = 0;
      let moving = false;
      for (const el of scenes) {
        const t = target.get(el) ?? 1;
        let s = shown.get(el) ?? t;
        s += (t - s) * 0.14;
        if (Math.abs(t - s) < 0.001) s = t;
        else moving = true;
        shown.set(el, s);
        const e = ease(s);
        const dir = side.get(el) ?? 1;
        el.style.transform = `translateY(${((1 - e) * 24 * dir).toFixed(1)}px) scale(${(0.985 + e * 0.015).toFixed(4)})`;
        el.style.opacity = (0.55 + e * 0.45).toFixed(3);
      }
      if (moving) raf = requestAnimationFrame(tick);
    };

    for (const el of scenes) {
      el.style.willChange = "transform, opacity";
      el.style.transformOrigin = "50% 50%";
    }
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      for (const el of scenes) {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.willChange = "";
      }
    };
  }, []);

  // the global theme background is near-black; on the bone home page it showed
  // through as hairlines wherever two sections meet on a fractional pixel
  return <style>{`html, body { background: #F2F1EC; }`}</style>;
}
