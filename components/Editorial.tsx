"use client";

import { useEffect, useRef } from "react";
import { Bodoni_Moda } from "next/font/google";
import { APP_STORE_URL, LIME } from "@/lib/brand";
import { ScrollWords } from "@/components/Motion";
import { useLang } from "@/lib/useLang";
import { localePath } from "@/lib/i18n";

// Editorial opening for the homepage: hero that melts into the paper,
// a letter-by-letter statement with inline photo pills, and a quick-facts
// block. Plain DOM + one scroll listener, no animation library.

const bodoni = Bodoni_Moda({ subsets: ["latin", "latin-ext"], weight: ["500"], style: ["normal"] });

const PAPER = "#F2F1EC";
const INK = "#141412";
const ACCENT = "#7A8F1F"; // darker lime: readable on paper

/** Splits text into per-letter spans; words stay unbroken. */
function Letters({ text, start = 0 }: { text: string; start?: number }) {
  let i = start;
  return (
    <>
      {text.split(" ").map((word, w, arr) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {word.split("").map((ch, c) => (
            <span key={c} className="ltr inline-block" style={{ ["--i" as string]: i++ }}>
              {ch}
            </span>
          ))}
          {w < arr.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

function Pill({ src, i }: { src: string; i: number }) {
  return (
    <span className="pill mx-[0.2em] inline-block overflow-hidden rounded-full align-[-0.08em]" style={{ ["--i" as string]: i }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-cover" />
    </span>
  );
}

/** Letter count of a phrase without spaces, to chain letter animations. */
const len = (t: string) => t.replace(/ /g, "").length;

const ED = {
  en: {
    eyebrow: "You · Daygo · Your clinic",
    title: ["Between", "visits."],
    heroAlt: "A hand holding a phone with the Daygo app",
    heroText: "Your watch, blood tests and how you feel in one app. With your consent, your clinic sees what changed between visits.",
    getApp: "Get the app →",
    forClinics: "For clinics →",
    statementLabel: "Daygo connects patients and clinics",
    statement: ["See you", "in a year", "isn't care."],
    moonAlt: ["The full Moon", "A waning Moon"],
    statementBody: "Most people see their clinic a few times a year. Daygo is the link in between: your app on one side, your clinician’s view on the other.",
    howTitle: "How it works",
    howBody: "Three steps between you and your clinic. You stay in control of every one.",
    steps: [
      ["Connect", "Your watch, your blood tests and how you feel, in one app."],
      ["Share", "With your consent, your clinician sees what changed since your last visit."],
      ["Follow up", "Retests and plans land on your phone, not in a forgotten letter."],
    ],
    sources: "Apple Health · Garmin · Oura · WHOOP · Any blood test · EU-hosted · Revoke any time",
  },
  lt: {
    eyebrow: "Jūs · Daygo · Jūsų klinika",
    title: ["Tarp", "vizitų."],
    heroAlt: "Ranka laiko telefoną su Daygo programėle",
    heroText: "Jūsų laikrodis, kraujo tyrimai ir savijauta vienoje programėlėje. Gavusi jūsų sutikimą, klinika mato, kas pasikeitė tarp vizitų.",
    getApp: "Gauti programėlę →",
    forClinics: "Klinikoms →",
    statementLabel: "Daygo sujungia pacientus ir klinikas",
    statement: ["„Pasimatysim", "po metų“", "nėra priežiūra."],
    moonAlt: ["Pilnatis", "Delčia"],
    statementBody: "Dauguma žmonių savo klinikoje lankosi vos kelis kartus per metus. Daygo yra jungtis tarp vizitų: viena pusė – jūsų programėlė, kita – gydytojo vaizdas.",
    howTitle: "Kaip tai veikia",
    howBody: "Trys žingsniai tarp jūsų ir jūsų klinikos. Kiekvieną jų kontroliuojate jūs.",
    steps: [
      ["Prijunkite", "Jūsų laikrodis, kraujo tyrimai ir savijauta vienoje programėlėje."],
      ["Dalinkitės", "Gavęs jūsų sutikimą, gydytojas mato, kas pasikeitė nuo paskutinio vizito."],
      ["Stebėkite", "Pakartotiniai tyrimai ir planai ateina į telefoną, o ne užmirštame laiške."],
    ],
    sources: "Apple Health · Garmin · Oura · WHOOP · Bet kokie kraujo tyrimai · Duomenys ES · Atšaukite bet kada",
  },
};

const JOURNEY = [
  { t: "You live your life", b: "Walk, run, sleep. Nothing new to learn." },
  { t: "Your watch tracks it", b: "Heart rate, HRV, sleep, all automatic." },
  { t: "Daygo makes sense of it", b: "One app with your labs and how you feel." },
  { t: "Your clinic sees what changed", b: "With your consent, before the next visit." },
];

/** Moon photo in a circle with a soft lime glow. */
function MoonPill({ i, phase = false, alt }: { i: number; phase?: boolean; alt: string }) {
  return (
    <span
      className="pill relative mx-[0.2em] inline-block overflow-hidden rounded-full align-[-0.08em]"
      style={{ ["--i" as string]: i, background: "#0d0d0c", boxShadow: "inset -0.04em -0.02em 0 0.012em #CDEE3C, 0 0 0.25em rgba(205,238,60,.25)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={phase ? "/hero/moon-2.jpg?v=2" : "/hero/moon.jpg?v=6"} alt={alt} className="h-full w-full object-cover" />
    </span>
  );
}

export function Editorial() {
  const lang = useLang();
  const c = ED[lang];
  const heroRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    // Reveal on view.
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.35 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Scroll-linked effects.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        const p = Math.min(1, y / (vh * 0.6));
        const jr = journeyRef.current;
        const v = videoRef.current;
        if (jr && v && v.duration) {
          const r = jr.getBoundingClientRect();
          const jp = Math.max(0, Math.min(1, -r.top / (r.height - vh)));
          v.currentTime = jp * (v.duration - 0.05);
          const t = v.currentTime;
          const step = t < 2.2 ? 0 : t < 4.6 ? 1 : t < 6.8 ? 2 : 3; // matches the film's cuts
          jr.querySelectorAll<HTMLElement>(".ed-step").forEach((el) => {
            const on = Number(el.dataset.step) <= step;
            el.style.opacity = on ? "1" : ".3";
          });
        }
        const pr = portraitRef.current;
        if (pr) {
          const r = pr.getBoundingClientRect();
          const t = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 roughly
          pr.style.setProperty("--par", `${Math.max(-7, Math.min(7, t * 7))}%`);
        }
      });
    };
    onScroll();
    videoRef.current?.addEventListener("loadedmetadata", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    // start the hero animation once the intro loader (if any) has lifted
    const go = () => requestAnimationFrame(() => root.classList.add("ed-loaded"));
    if (window.__daygoIntroDone) go();
    else window.addEventListener("daygo:intro-done", go, { once: true });
    return () => {
      window.removeEventListener("daygo:intro-done", go);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ed" style={{ background: PAPER, color: INK }}>
      {/* ── 1 · HERO ── */}
      <section ref={heroRef} className="relative overflow-hidden px-5 pb-12 pt-14 sm:px-8 md:px-12">
        <p className="ed-fade text-center text-[10.5px] font-semibold uppercase tracking-[.2em]" style={{ color: ACCENT }}>
          {c.eyebrow}
        </p>
        <h1 className={`${bodoni.className} ed-title relative z-0 mt-4 text-center text-[17vw] uppercase leading-[.8] tracking-[.01em] md:text-[12.5vw]`}>
          <Letters text={c.title[0]} />
          <br />
          <Letters text={c.title[1]} start={len(c.title[0])} />
        </h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/phone-cutout.webp"
          alt={c.heroAlt}
          className="ed-cut relative z-10 mx-auto -mt-[16vw] w-[80vw] max-w-[520px] md:-mt-[14vw] md:w-[32vw]"
        />
        <div className="ed-fade relative z-20 mt-8 flex flex-col gap-6 md:absolute md:inset-x-12 md:bottom-[84px] md:mt-0 md:flex-row md:items-end md:justify-between" style={{ transitionDelay: "1s" }}>
          <p className="max-w-[17rem] text-[15px] leading-relaxed" style={{ color: `${INK}B8` }}>
            {c.heroText}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={APP_STORE_URL} className="rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[.16em] text-white" style={{ background: INK }}>
              {c.getApp}
            </a>
            <a href={localePath(lang, "/clinics")} className="rounded-full border bg-white/50 px-6 py-3 text-[11px] font-semibold uppercase tracking-[.16em] backdrop-blur" style={{ borderColor: `${INK}30` }}>
              {c.forClinics}
            </a>
          </div>
        </div>
      </section>

      {/* ── 2 · STATEMENT ── */}
      <section className="reveal relative" style={{ height: "170svh" }}>
        <div data-scene className="sticky top-0 flex h-[100svh] flex-col items-center justify-center px-6 text-center">
        <p className="ed-up text-[10.5px] font-semibold uppercase tracking-[.2em]" style={{ color: ACCENT }}>
          {c.statementLabel}
        </p>
        <h2 className={`${bodoni.className} mt-8 text-[8.6vw] uppercase leading-[1.06] md:text-[clamp(40px,7.2vw,132px)]`}>
          <Letters text={c.statement[0]} />
          <MoonPill i={0} alt={c.moonAlt[0]} />
          <Letters text={c.statement[1]} start={len(c.statement[0])} />
          <br />
          <MoonPill i={1} phase alt={c.moonAlt[1]} />
          <Letters text={c.statement[2]} start={len(c.statement[0]) + len(c.statement[1])} />
        </h2>
        <ScrollWords
          className="mt-10 max-w-lg text-[17px] leading-relaxed md:text-[19px]"
          style={{ color: INK }}
          text={c.statementBody}
        />
        </div>
      </section>

      {/* ── 3 · QUICK FACTS ── */}
      <section className="reveal relative md:h-[165svh]">
        <div data-scene className="px-6 py-28 md:sticky md:top-0 md:flex md:h-[100svh] md:items-center md:px-10 md:py-0">
        <div className="mx-auto w-full max-w-[1180px]">
          {/* header: title left, one line of context right */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className={`${bodoni.className} text-[12vw] uppercase leading-[.95] md:text-[clamp(40px,5.4vw,84px)]`}>
              <Letters text={c.howTitle} />
            </h2>
            <p className="ed-up max-w-xs text-[15px] leading-relaxed md:pb-3 md:text-right" style={{ color: `${INK}B8`, transitionDelay: ".3s" }}>
              {c.howBody}
            </p>
          </div>

          {/* three steps as a sequence: a hairline with a lime node per step */}
          <ol className="relative mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-0">
            <span aria-hidden className="absolute left-0 right-0 top-[5px] hidden h-px md:block" style={{ background: `${INK}29` }} />
            {c.steps.map(([t, b], n) => (
              <li key={t} className="ed-up relative md:pr-10" style={{ transitionDelay: `${0.35 + n * 0.14}s` }}>
                <span aria-hidden className="relative block h-[11px] w-[11px] rounded-full" style={{ background: LIME, boxShadow: `0 0 0 4px ${PAPER}` }} />
                <span className={`${bodoni.className} mt-8 block text-[64px] leading-none md:text-[80px]`} style={{ color: `${INK}26` }}>
                  0{n + 1}
                </span>
                <span className={`${bodoni.className} mt-4 block text-[30px] uppercase leading-none md:text-[34px]`}>{t}</span>
                <span className="mt-4 block max-w-[19rem] text-[15px] leading-relaxed" style={{ color: `${INK}B8` }}>{b}</span>
              </li>
            ))}
          </ol>

          <p className="ed-up mt-16 border-t pt-6 text-[10.5px] font-semibold uppercase tracking-[.2em]" style={{ borderColor: `${INK}1A`, color: `${INK}80`, transitionDelay: ".8s" }}>
            {c.sources}
          </p>
        </div>
        </div>
      </section>

      <style>{`
        .ed .ltr { transform: translateY(.55em) rotate(4deg); opacity: 0; transition: transform .9s cubic-bezier(.2,.7,.2,1), opacity .9s; transition-delay: calc(var(--i) * 26ms); }
        .ed .reveal.in .ltr { transform: none; opacity: 1; }
        .ed .ed-title .ltr { transform: translateY(.18em); filter: blur(10px); transition: transform 1.1s cubic-bezier(.2,.7,.2,1), opacity 1.1s, filter 1.1s; transition-delay: calc(var(--i) * 95ms + .2s); }
        .ed-loaded .ed .ed-title .ltr { transform: none; opacity: 1; filter: none; }
        .ed .pill { width: .86em; height: .86em; transform: scale(0); transition: transform .8s cubic-bezier(.34,1.56,.64,1); transition-delay: calc(.35s + var(--i) * .25s); }
        .ed .pill img { transform: scale(1.5); transition: transform 1.2s ease; transition-delay: inherit; }
        .ed .reveal.in .pill, .ed .reveal.in .pill img { transform: none; }
        .ed .ed-up { opacity: 0; transform: translateY(22px); transition: opacity .9s, transform .9s cubic-bezier(.2,.7,.2,1); }
        .ed .reveal.in .ed-up { opacity: 1; transform: none; }
        .ed .ed-fade { opacity: 0; transform: translateY(-8px); transition: opacity 1s .1s, transform 1s .1s; }
        .ed-loaded .ed .ed-fade { opacity: 1; transform: none; }
        .ed .ed-pill { opacity: 0; transform: translate(-50%, 16px); transition: opacity .9s 1.05s, transform .9s 1.05s; }
        .ed-loaded .ed .ed-pill { opacity: 1; transform: translate(-50%, 0); }
        .ed .ed-photo { -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 38%); mask-image: linear-gradient(90deg, transparent 0%, #000 38%); }
        @media (max-width: 767px) { .ed .ed-photo { -webkit-mask-image: none; mask-image: none; } }
        .ed .ed-photo { transform: scale(1.06); transition: transform 2.2s cubic-bezier(.2,.7,.2,1); }
        .ed-loaded .ed .ed-photo { -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 38%); mask-image: linear-gradient(90deg, transparent 0%, #000 38%); }
        @media (max-width: 767px) { .ed .ed-photo { -webkit-mask-image: none; mask-image: none; } }
        .ed .ed-photo { transform: scale(1); }
        .ed .ed-cut { -webkit-mask-image: linear-gradient(to bottom, #000 72%, transparent 98%), linear-gradient(to right, transparent 0%, #000 22%); -webkit-mask-composite: source-in; mask-image: linear-gradient(to bottom, #000 72%, transparent 98%), linear-gradient(to right, transparent 0%, #000 22%); mask-composite: intersect; }
        .ed .ed-cut { opacity: 0; transform: translateY(40px) scale(.97); transition: opacity 1.2s .5s, transform 1.4s cubic-bezier(.2,.7,.2,1) .5s; }
        .ed-loaded .ed .ed-cut { opacity: 1; transform: none; }
        .ed .ed-stage { transform: translateY(var(--drift, 0)); filter: blur(calc(var(--melt, 0) * 6px)); }
        .ed .ed-melt { height: calc(34% + var(--melt, 0) * 66%); opacity: calc(.6 + var(--melt, 0) * .4); z-index: 5; }
        .ed .ed-portrait { clip-path: inset(100% 0 0 0); transition: clip-path 1.2s cubic-bezier(.7,0,.2,1) .3s; }
        .ed .reveal.in .ed-portrait { clip-path: inset(0); }
        .ed .ed-portrait img { transform: translateY(var(--par, 0)) scale(1.25); transition: transform 1.4s cubic-bezier(.2,.7,.2,1) .3s; }
        .ed .reveal.in .ed-portrait img { transform: translateY(var(--par, 0)) scale(1.15); }
        .ed .ed-ticks { animation: ed-spin 16s linear infinite; }
        @keyframes ed-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .ed *, .ed *::before { transition: none !important; animation: none !important; }
          .ed .ltr, .ed .pill, .ed .pill img, .ed .ed-up, .ed .ed-fade, .ed .ed-pill, .ed .ed-photo { opacity: 1 !important; transform: none !important; filter: none !important; }
          .ed .ed-pill { transform: translateX(-50%) !important; }
          .ed .ed-portrait { clip-path: none !important; }
        }
      `}</style>
    </div>
  );
}


const FEATURES_BY_LANG = {
  en: [
    { t: "Sleep & recovery", b: "Understand your sleep and get recommendations that fit your real life.", img: "/phones/today.webp", alt: "Daygo Today screen: 71% readiness, train normally" },
    { t: "Training", b: "See patterns, avoid overtraining and improve consistently.", img: "/phones/training.webp", alt: "Daygo workout screen: a 7 km run mapped by heart effort" },
    { t: "Bloodwork", b: "Turn your lab results into plain English and practical next steps.", img: "/phones/labs.webp", alt: "Daygo lab values: 4 to watch, 17 in range" },
    { t: "AI coach", b: "Remembers what matters and learns from your patterns over time.", img: "/phones/coach.webp", alt: "Daygo coach chat explaining a high CRP result" },
  ],
  lt: [
    { t: "Miegas ir atsistatymas", b: "Supraskite savo miegą ir gaukite rekomendacijas, kurios tinka jūsų tikram gyvenimui.", img: "/phones/today.webp", alt: "Daygo „Šiandien“ ekranas: 71 % pasirengimas, treniruokitės įprastai" },
    { t: "Treniruotės", b: "Pastebėkite dėsningumus, išvenkite persitreniravimo ir tobulėkite nuosekliai.", img: "/phones/training.webp", alt: "Daygo treniruotės ekranas: 7 km bėgimas pagal širdies krūvį" },
    { t: "Kraujo tyrimai", b: "Tyrimų rezultatai paprasta kalba ir su praktiniais tolesniais žingsniais.", img: "/phones/labs.webp", alt: "Daygo tyrimų rodikliai: 4 stebėtini, 17 normos ribose" },
    { t: "DI treneris", b: "Prisimena, kas svarbu, ir laikui bėgant mokosi iš jūsų dėsningumų.", img: "/phones/coach.webp", alt: "Daygo trenerio pokalbis, aiškinantis padidėjusį CRB" },
  ],
};
const FEATURES_ED = FEATURES_BY_LANG.en;

const FEAT_HEAD = {
  en: { label: "For patients", title: ["Not another tracker.", "A coach."], body: "Daygo connects your data, adds context, and turns it into clear, personal guidance you can actually follow." },
  lt: { label: "Pacientams", title: ["Ne dar vienas sekiklis.", "Treneris."], body: "Daygo sujungia jūsų duomenis, prideda kontekstą ir paverčia juos aiškiais, asmeniškais patarimais, kurių iš tikrųjų galima laikytis." },
};

/**
 * Patient features as a pinned scroll scene: the headline and feature list stay
 * on the left while one phone on the right crossfades through the four app screens.
 * On small screens it falls back to a plain stacked list.
 */
export function EditorialFeatures() {
  const lang = useLang();
  const feats = FEATURES_BY_LANG[lang];
  const head = FEAT_HEAD[lang];
  const track = useRef<HTMLDivElement>(null);
  const phones = useRef<(HTMLImageElement | null)[]>([]);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const segs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let target = 0;
    let shown = 0;
    const n = FEATURES_ED.length;

    const paint = () => {
      // position along the screens, e.g. 1.4 = between screen 2 and 3
      // each screen holds still for most of its stretch, then flips quickly
      const seg = Math.min(n - 1, Math.max(0, shown * (n - 1)));
      const base = Math.min(n - 2, Math.floor(seg));
      const f = Math.max(0, Math.min(1, (seg - base - 0.25) / 0.5));
      const pos = base + f * f * (3 - 2 * f);
      phones.current.forEach((el, i) => {
        if (!el) return;
        const d = i - pos; // <0 already shown, 0 current, >0 coming
        // crossfade: the frame never moves; the next screen fades in on top of the
        // current one, which stays solid underneath until it is fully covered
        const op = d > 0 ? Math.max(0, Math.min(1, 1 - d)) : d > -1 ? 1 : 0;
        el.style.transform = "none";
        el.style.opacity = String(op);
        el.style.zIndex = String(i + 1); // later screens fade in on top
      });
      const active = Math.round(pos);
      items.current.forEach((el, i) => el?.classList.toggle("ft-on", i === active));
      // one segment per screen; the current one fills as you scroll through it
      const t = Math.min(n, shown * n);
      segs.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleX(${Math.max(0, Math.min(1, t - i))})`;
      });
    };

    const read = () => {
      const t = track.current;
      if (!t) return;
      const r = t.getBoundingClientRect();
      const span = t.offsetHeight - window.innerHeight;
      // hold the first and last screens briefly at each end
      const raw = Math.max(0, Math.min(1, -r.top / Math.max(1, span)));
      target = Math.max(0, Math.min(1, (raw - 0.06) / 0.88));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      raf = 0;
      shown += (target - shown) * (reduce ? 1 : 0.09);
      if (Math.abs(target - shown) < 0.0005) shown = target;
      paint();
      if (shown !== target) raf = requestAnimationFrame(tick);
    };

    read();
    paint();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  return (
    <section id="features" className="ed scroll-mt-6" style={{ background: PAPER, color: INK }}>
      {/* statement: its own moment, held briefly like the other statements */}
      <div className="reveal relative" style={{ height: "160svh" }}>
        <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center px-6 text-center">
          <p className="ed-up text-[10.5px] font-semibold uppercase tracking-[.2em]" style={{ color: ACCENT }}>
            {head.label}
          </p>
          <h2 className={`${bodoni.className} mt-8 uppercase leading-[1] text-[11vw] md:text-[clamp(48px,7vw,124px)]`}>
            <Letters text={head.title[0]} />
            <br />
            <Letters text={head.title[1]} start={len(head.title[0])} />
          </h2>
          <p className="ed-up mt-10 max-w-md text-[16px] leading-relaxed" style={{ color: `${INK}B8`, transitionDelay: ".7s" }}>
            {head.body}
          </p>
        </div>
      </div>

      {/* desktop: pinned phone scene */}
      <div ref={track} className="relative hidden md:block" style={{ height: "600svh" }}>
        <div className="reveal sticky top-0 flex h-[100svh] items-center overflow-hidden px-12">
          <div className="mx-auto grid w-full max-w-[1180px] grid-cols-[1.1fr_.9fr] items-center gap-12">
            <div>
              {/* only the current feature shows; it crossfades with the phone */}
              <div className="relative h-[10.5rem]">
                {feats.map((f, i) => (
                  <div
                    key={f.t}
                    ref={(el) => {
                      items.current[i] = el;
                    }}
                    className="ft-item absolute inset-x-0 top-0"
                  >
                    <p className="text-[10.5px] font-semibold tracking-[.2em]" style={{ color: ACCENT }}>
                      0{i + 1} / 0{feats.length}
                    </p>
                    <p className={`${bodoni.className} mt-4 text-[clamp(30px,3vw,44px)] uppercase leading-none`}>{f.t}</p>
                    <p className="mt-4 max-w-md text-[16px] leading-relaxed" style={{ color: `${INK}99` }}>{f.b}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex max-w-[18rem] gap-2">
                {feats.map((f, i) => (
                  <span key={f.t} className="h-[2px] flex-1 overflow-hidden rounded" style={{ background: `${INK}1A` }}>
                    <span
                      ref={(el) => {
                        segs.current[i] = el;
                      }}
                      className="block h-full w-full origin-left"
                      style={{ background: INK, transform: i === 0 ? "scaleX(.05)" : "scaleX(0)" }}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto h-[min(78svh,720px)] aspect-[1015/2000]">
              {feats.map((f, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={f.img}
                  ref={(el) => {
                    phones.current[i] = el;
                  }}
                  src={f.img}
                  alt={f.alt}
                  className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_30px_50px_rgba(20,20,18,0.22)]"
                  style={{ opacity: i === 0 ? 1 : 0, transformOrigin: "50% 100%", willChange: "transform, opacity" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* mobile: simple stacked list */}
      <div className="reveal px-5 pb-24 sm:px-8 md:hidden">
        <div className="grid gap-14 sm:grid-cols-2">
          {feats.map((f, i) => (
            <div key={f.t} className="ed-up" style={{ transitionDelay: `${0.3 + i * 0.1}s` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.img} alt={f.alt} loading="lazy" className="mb-6 block w-full max-w-[220px] drop-shadow-[0_24px_40px_rgba(20,20,18,0.18)]" />
              <p className="text-[10.5px] font-semibold tracking-[.2em]" style={{ color: ACCENT }}>0{i + 1}</p>
              <h3 className={`${bodoni.className} mt-3 text-[26px] uppercase leading-none`}>{f.t}</h3>
              <p className="mt-3 text-[14px] leading-relaxed" style={{ color: `${INK}99` }}>{f.b}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ft-item { opacity: 0; transform: translateY(14px); transition: opacity .5s, transform .6s cubic-bezier(.2,.7,.2,1); pointer-events: none; }
        .ft-item.ft-on { opacity: 1; transform: none; transition-delay: .12s; pointer-events: auto; }
      `}</style>
    </section>
  );
}
