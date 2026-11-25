"use client";

import { useEffect } from "react";

/**
 * Reveal motion for the /clinics page, matching the home page:
 * - headline letters (`.ltr`, with a `--i` index) rise in one by one
 * - blocks marked `.rv` fade up, staggered in reading order
 * Both start when their `[data-reveal]` section scrolls into view.
 */
export function ClinicMotion() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    sections.forEach((sec) => {
      sec.querySelectorAll<HTMLElement>(".rv").forEach((el, i) => {
        el.style.transitionDelay = `${0.25 + i * 0.09}s`;
      });
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.2 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <style>{`
      [data-reveal] .ltr { display: inline-block; transform: translateY(.55em) rotate(4deg); opacity: 0; transition: transform .9s cubic-bezier(.2,.7,.2,1), opacity .9s; transition-delay: calc(var(--i) * 26ms); }
      [data-reveal].is-in .ltr { transform: none; opacity: 1; }
      [data-reveal] .rv { opacity: 0; transform: translateY(22px); transition: opacity .9s, transform .9s cubic-bezier(.2,.7,.2,1); }
      [data-reveal].is-in .rv { opacity: 1; transform: none; }
      @media (prefers-reduced-motion: reduce) {
        [data-reveal] .ltr, [data-reveal] .rv { opacity: 1 !important; transform: none !important; transition: none !important; }
      }
    `}</style>
  );
}
