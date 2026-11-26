"use client";

import { useEffect, useRef } from "react";
import { APP_STORE_URL, BOOK_CALL_URL } from "@/lib/brand";
import { Bodoni_Moda } from "next/font/google";
import { RotatingWords } from "@/components/Motion";
import { useLang } from "@/lib/useLang";
import { localePath, type Lang } from "@/lib/i18n";

const GS = {
  en: {
    mockLabel: "Daygo for clinics",
    mockTitle: ["See every patient,", "between visits."],
    laptopAria: "The Daygo clinic dashboard on a laptop",
    clinicianAlt: "A clinician looking at the Daygo dashboard",
    tagsTop: ["• For clinics", "• Between visits"],
    insight: "Insight",
    insightBody: "One view of what changed for each patient since you last saw them.",
    insightMuted: " Every visit starts from where they are, not from zero.",
    forClinicsBtn: "Daygo for clinics",
    clinicsWord: "Clinics",
    tags: ["/ For private clinics", "/ Preventive care", "/ Between visits"],
    intro: "Your patients already track their health. Daygo brings it to you, with their consent.",
    ctaTitle: ["Ready to take", "control of your"],
    ctaWords: ["sleep?", "training?", "bloodwork?", "health?"],
    download: "Download on the App Store",
    founderAlt: "Marijus Dovydaitis, founder of Daygo",
    founderLine: "Run a clinic? Talk with Marijus",
    founderRole: "Founder of Daygo",
    bookCall: "Book a 30-min call",
  },
  lt: {
    mockLabel: "Daygo klinikoms",
    mockTitle: ["Matykite kiekvieną pacientą", "tarp vizitų."],
    laptopAria: "Daygo klinikos skydelis nešiojamajame kompiuteryje",
    clinicianAlt: "Gydytojas žiūri į Daygo skydelį",
    tagsTop: ["• Klinikoms", "• Tarp vizitų"],
    insight: "Įžvalga",
    insightBody: "Vienoje vietoje matote, kas pasikeitė kiekvienam pacientui nuo paskutinio susitikimo.",
    insightMuted: " Kiekvienas vizitas prasideda nuo to, kur pacientas yra dabar, o ne nuo nulio.",
    forClinicsBtn: "Daygo klinikoms",
    clinicsWord: "Klinikos",
    tags: ["/ Privačioms klinikoms", "/ Prevencinė priežiūra", "/ Tarp vizitų"],
    intro: "Jūsų pacientai jau stebi savo sveikatą. Daygo, gavusi jų sutikimą, perduoda tai jums.",
    ctaTitle: ["Pasiruošę", "pasirūpinti savo"],
    ctaWords: ["miegu?", "treniruotėmis?", "tyrimais?", "sveikata?"],
    download: "Atsisiųsti iš App Store",
    founderAlt: "Marijus Dovydaitis, Daygo įkūrėjas",
    founderLine: "Turite kliniką? Pasikalbėkite su Marijumi",
    founderRole: "Daygo įkūrėjas",
    bookCall: "Užsisakyti 30 min. pokalbį",
  },
};

/** Letter spans for the title reveal; --k counts letters across both lines. */
function TitleLetters({ lines }: { lines: string[] }) {
  let k = 0;
  return (
    <>
      {lines.map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {line.split(" ").map((word, wi, arr) => (
            <span key={wi}>
              <span className="inline-block whitespace-nowrap">
                {word.split("").map((ch, ci) => (
                  <span key={ci} className="gs-l" style={{ ["--k" as string]: k++ }}>
                    {ch}
                  </span>
                ))}
              </span>
              {wi < arr.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

const bodoni = Bodoni_Moda({ subsets: ["latin", "latin-ext"], weight: ["500"], style: ["normal"] });

// Light take on the "glass over full-bleed image" layout: mono slash labels,
// left-accent badges, a frosted numbered panel and a founder contact card.

const INK = "#141412";

function ChevronRight({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
const DEMO = BOOK_CALL_URL;

function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>(".gs-r") ?? [];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("gs-in"), io.unobserve(e.target))),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

const d = (ms: number) => ({ transitionDelay: `${ms}ms` });

/** Reversed MacBook mockup film that plays once when it comes into view, with the
 *  clinician cut-out layered in front (over-the-shoulder). */
function ClinicMockup({ lang }: { lang: Lang }) {
  const c = GS[lang];
  const track = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const haze = useRef<HTMLDivElement>(null);
  const fade = useRef<HTMLDivElement | null>(null);
  const title = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    let target = 0;
    let shown = 0;
    let last = { time: -1, inn: false, melt: -1, show: false };
    const read = () => {
      const t = track.current;
      if (!t) return;
      const r = t.getBoundingClientRect();
      // ignore scrolling far away from the scene
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const span = t.offsetHeight - window.innerHeight;
      target = Math.max(0, Math.min(1, -r.top / Math.max(1, span)));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      raf = 0;
      shown += (target - shown) * 0.18;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      // the scene plays out over the first 72% of the track; the last 28% holds
      // "See every patient, between visits." pinned in place
      const k = Math.min(1, shown / 0.72);
      const v = vid.current;
      if (v && v.duration) {
        const time = Math.round(Math.min(1, k / 0.48) * (v.duration - 0.05) * 30) / 30; // whole frames only
        if (time !== last.time) { v.currentTime = time; last.time = time; }
      }
      const inn = k > 0.5;
      if (inn !== last.inn) { box.current?.classList.toggle("gs-in", inn); last.inn = inn; }
      const m = Math.max(0, Math.min(1, (k - 0.66) / 0.34));
      const melt = Math.round(m * m * (3 - 2 * m) * 100) / 100;
      if (melt !== last.melt) {
        last.melt = melt;
        if (box.current) box.current.style.filter = melt > 0 ? `blur(${(melt * 6).toFixed(1)}px)` : "none";
        haze.current?.style.setProperty("--melt", String(melt));
        fade.current?.style.setProperty("--melt", String(melt));
      }
      const show = melt > 0.85;
      if (show !== last.show) { title.current?.classList.toggle("gs-show", show); last.show = show; }
      if (shown !== target) raf = requestAnimationFrame(tick); // stop when settled
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);
  return (
    <div ref={track} className="relative mt-10" style={{ height: "580svh" }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div ref={box} className="relative mx-auto w-full max-w-[1180px]" style={{ willChange: "filter" }}>
          <video
            ref={vid}
            src="/hero/clinic-mockup.mp4"
            poster="/hero/clinic-mockup-poster.jpg"
            muted
            playsInline
            preload="auto"
            className="gs-lap block w-full"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)",
              WebkitMaskComposite: "source-in",
              maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)",
              maskComposite: "intersect",
            }}
            aria-label={c.laptopAria}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/clinician.webp"
            alt={c.clinicianAlt}
            className="gs-clin pointer-events-none absolute bottom-[-60%] left-1/2 w-[86%] -translate-x-1/2"
            style={{ WebkitMaskImage: "linear-gradient(to bottom, #000 62%, transparent 92%)", maskImage: "linear-gradient(to bottom, #000 62%, transparent 92%)" }}
          />
        </div>
        <div
          ref={haze}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
          style={{
            height: "calc(30% + var(--melt, 0) * 70%)",
            opacity: "var(--melt, 0)",
            background: "linear-gradient(to bottom, rgba(242,241,236,0), #F2F1EC 55%)",
          }}
        />
        <div ref={title} className="gs-title pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <p className="gs-l mb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-black/50" style={{ ["--k" as string]: 0 }}>
            {c.mockLabel}
          </p>
          <h2 className="text-5xl font-normal leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">
            <TitleLetters lines={c.mockTitle} />
          </h2>
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: "#F2F1EC", opacity: "calc(var(--melt, 0) * var(--melt, 0) * var(--melt, 0))" }}
          ref={(el) => {
            // share the --melt variable with the full-cover fade
            if (el && haze.current) el.style.setProperty("--melt", "0");
            fade.current = el;
          }}
        />
      </div>
    </div>
  );
}

/** Dark, full-bleed closing scene for the clinic section: the dashboard drifts
 *  in slowly behind frosted glass as you scroll through it. */
function ClinicInsight({ lang }: { lang: Lang }) {
  const c = GS[lang];
  const sec = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLImageElement>(null);
  useEffect(() => {
    let raf = 0;
    let target = 0;
    let shown = 0;
    const read = () => {
      const s = sec.current;
      if (!s) return;
      const r = s.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      target = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      raf = 0;
      shown += (target - shown) * 0.12;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      if (bg.current) bg.current.style.transform = `scale(${(1.18 - shown * 0.14).toFixed(4)}) translateY(${((0.5 - shown) * 4).toFixed(2)}%)`;
      if (shown !== target) raf = requestAnimationFrame(tick);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  return (
    <div
      ref={sec}
      data-scene
     
     
      className="relative mx-auto w-full max-w-[1240px] overflow-hidden rounded-[24px] text-white"
      style={{ background: "#d9d6d2" }}
    >
      {/* left half: the same photo, blurred by the frosted glass on top of it */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/clinic/mountain-peak.jpg"
        alt=""
        className="pointer-events-none absolute inset-y-0 left-0 hidden h-full w-1/2 object-cover object-[50%_45%] md:block"
      />
      {/* right half: the photo sharp, close to its natural portrait shape */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={bg}
        src="/clinic/mountain-peak.jpg"
        alt=""
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-full object-cover object-[50%_40%] md:w-1/2"
        style={{ transform: "scale(1.18)", willChange: "transform" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* frosted left half */}
      <div className="relative z-10 flex min-h-[640px] w-full flex-col justify-between md:h-[min(82svh,760px)] border-white/25 px-5 pb-8 pt-8 sm:px-8 md:w-1/2 md:border-r md:px-10 md:pb-10">
        {/* frosted glass with the Daygo wordmark cut out of it, so the photo shows through sharp */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-neutral-800/45 md:bg-neutral-500/20 backdrop-blur-[14px]"
          style={{
            WebkitMaskImage: "url(/daygo-wordmark.webp), linear-gradient(#000, #000)",
            maskImage: "url(/daygo-wordmark.webp), linear-gradient(#000, #000)",
            WebkitMaskSize: "86% auto, 100% 100%",
            maskSize: "86% auto, 100% 100%",
            WebkitMaskPosition: "50% 15%, 0 0",
            maskPosition: "50% 15%, 0 0",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
          <span className="gs-r" style={d(80)}>{c.tagsTop[0]}</span>
          <span className="gs-r" style={d(160)}>{c.tagsTop[1]}</span>
        </div>

        <div className="mt-[38vh] md:mt-0">
          <p className="gs-r text-[10px] font-medium uppercase tracking-[0.2em] text-white/60" style={d(120)}>{c.insight}</p>
          <p className="gs-r mt-3 max-w-lg text-xl leading-snug sm:text-2xl" style={d(200)}>
            {c.insightBody}
            <span className="text-white/60">{c.insightMuted}</span>
          </p>

          <div className="gs-r mt-10" style={d(320)}>
            <a href={localePath(lang, "/clinics")} className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-[13px] font-medium text-black transition-colors duration-300 hover:bg-white/85">
              {c.forClinicsBtn} <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* sharp right half details */}
      <span aria-hidden className="pointer-events-none absolute right-8 top-8 z-10 hidden text-lg md:block" style={{ color: "#CDEE3C" }}>✱✱</span>
      <p
        aria-hidden
        className={`${bodoni.className} pointer-events-none absolute bottom-[-0.08em] right-6 z-10 hidden select-none uppercase leading-none text-white md:block`}
        style={{ fontSize: "clamp(4.5rem, 8.5vw, 8.5rem)" }}
      >
        {c.clinicsWord}
      </p>
    </div>
  );
}

export function ClinicGlass() {
  const ref = useReveal();
  const lang = useLang();
  const c = GS[lang];
  return (
    <section ref={ref} id="clinics" style={{ background: "#F2F1EC", color: INK }} className="isolate relative flex min-h-[100svh] scroll-mt-6 flex-col justify-between overflow-x-clip px-5 pb-12 pt-24 sm:px-8 md:px-12 md:pb-16">

      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2">
          {c.tags.map((t, i) => (
            <p key={t} className="gs-r text-xs font-medium uppercase tracking-[0.15em]" style={d(150 + i * 120)}>{t}</p>
          ))}
        </div>
        <p className="gs-r max-w-xs text-lg leading-relaxed sm:text-right sm:text-xl" style={d(300)}>
          {c.intro}
        </p>
      </div>

      <ClinicMockup lang={lang} />

      {/* the card holds in place for a moment on desktop, like the other key sections */}
      <div className="relative mt-20 md:mt-0 md:h-[165svh]">
        <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:items-center">
          <ClinicInsight lang={lang} />
        </div>
      </div>
      <Styles />
    </section>
  );
}

export function FounderCTA() {
  const ref = useReveal();
  const lang = useLang();
  const c = GS[lang];
  return (
    <section ref={ref} className="isolate relative overflow-hidden px-5 pb-[17vw] pt-20 sm:px-8 md:px-12 md:pt-28" style={{ background: "#F2F1EC", color: INK }}>
      {/* the official wordmark, edge to edge and faint, as a backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/daygo-wordmark.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[1.5vw] -z-10 w-full select-none px-3 opacity-[0.07] invert sm:px-5"
      />

      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="gs-r text-5xl font-normal leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl" style={d(150)}>
            {c.ctaTitle[0]}
            <br />
            {c.ctaTitle[1]}
            <br />
            <RotatingWords key={lang} words={c.ctaWords} />
          </h2>
          <div className="gs-r mt-8 flex flex-wrap gap-3" style={d(300)}>
            <a href={APP_STORE_URL} className="flex items-center gap-1 rounded-full px-5 py-2.5 text-sm font-medium text-white hover:opacity-85" style={{ background: INK }}>
              {c.download} <ChevronRight size={14} />
            </a>
          </div>
        </div>

        <div className="gs-r flex items-center gap-4 self-start rounded-xl border border-black/10 bg-white/70 p-3 shadow-[0_12px_40px_rgba(20,20,18,0.06)] md:self-auto" style={d(420)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/clinic/founder.jpg" alt={c.founderAlt} className="h-24 w-20 rounded-lg object-cover" />
          <div className="flex flex-col gap-1.5 pr-2">
            <p className="text-sm font-medium">{c.founderLine}</p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-black/55">{c.founderRole}</p>
            <a href={DEMO} target="_blank" rel="noopener noreferrer" className="mt-1.5 flex w-fit items-center gap-1 rounded-full px-4 py-2 text-xs font-medium text-white hover:opacity-85" style={{ background: INK }}>
              {c.bookCall} <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
      <Styles />
    </section>
  );
}

function Styles() {
  return (
    <style>{`
      .gs-r { opacity: 0; transform: translateY(2rem); transition: all 700ms ease-out; will-change: transform; }
      .gs-r.gs-in { opacity: 1; transform: none; }
      .gs-clin { opacity: 0; transform: translate(-50%, 10%); transition: opacity .9s ease-out, transform 1.2s cubic-bezier(.2,.7,.2,1); }
      .gs-in > .gs-clin { opacity: 1; transform: translate(-50%, 0); }
      .gs-title .gs-l { display: inline-block; opacity: 0; transform: translateY(.5em) rotate(3deg); filter: blur(6px); transition: opacity .7s, transform .9s cubic-bezier(.2,.7,.2,1), filter .7s; transition-delay: calc(var(--k) * 28ms); }
      .gs-title.gs-show .gs-l { opacity: 1; transform: none; filter: none; }
      .gs-lap { transform-origin: 50% 35%; transition: transform 1.2s cubic-bezier(.2,.7,.2,1); }
      .gs-in > .gs-lap { transform: scale(.72) translateY(-6%); }
      @media (prefers-reduced-motion: reduce) { .gs-r { opacity: 1; transform: none; transition: none; } }
    `}</style>
  );
}
