import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SleepChart, RunnerChart, LdlCompare, MemoryRecall } from "@/components/FeatureCharts";
import { APP_STORE_URL, BONE, LIME } from "@/lib/brand";
import { FanIn, FanOut } from "@/components/Diagram";
import { HeroHeadline } from "@/components/HeroHeadline";

// The marketing home page. Chrome (nav/footer) and brand tokens are shared
// with the legal, support and labs pages so the site reads as one thing.

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <MoreContext />
        <HowItWorks />
        <SmallSteps />
        <Pricing />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

/* ================================ HERO ================================ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-black px-6 pb-16 pt-10 text-white md:px-10 md:pb-24">
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
        {/* left rail micro-index */}
        <div className="pointer-events-none absolute right-full top-8 mr-8 hidden whitespace-nowrap text-right font-mono text-[9px] uppercase leading-relaxed tracking-widest text-white/35 2xl:block">
          <div>01</div>
          <div className="mb-3">Data</div>
          <div>02</div>
          <div className="mb-3">Insights</div>
          <div>03</div>
          <div className="mb-8">Action</div>
          <div className="text-white/45">
            Less noise
            <br />
            More progress
          </div>
        </div>
        {/* right rail ticks */}
        <div className="pointer-events-none absolute left-full top-8 ml-8 hidden whitespace-nowrap font-mono text-[9px] uppercase leading-relaxed tracking-widest text-white/25 2xl:block">
          <div>// No ads</div>
          <div>// No data resold</div>
          <div>// Not a medical device</div>
        </div>

        {/* ---- copy column ---- */}
        <div className="relative">
          <HeroHeadline />

          <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-white/65">
            Daygo reads your health data, finds what matters, and gives you personalized guidance — so you can make
            better decisions, every day.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href={APP_STORE_URL}
              style={{ background: LIME }}
              className="flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[14px] font-semibold text-black transition hover:opacity-90"
            >
              <AppleMark className="h-[18px] w-[18px]" />
              Download on the App Store
            </a>
          </div>

          <div className="mt-10 font-mono text-[10px] uppercase leading-relaxed tracking-widest text-white/40 2xl:hidden">
            Less noise
            <br />
            More progress
          </div>
        </div>

        {/* ---- phone column ---- */}
        <div className="relative">
          {/* data-source list with bracket + arrow, pointing at the phone */}
          <div className="absolute -left-6 top-4 z-10 hidden lg:block">
            <div className="border-l border-white/25 pl-3 font-mono text-[10px] uppercase leading-[1.9] tracking-widest text-white/60">
              <div>Sleep</div>
              <div>Training</div>
              <div>Bloodwork</div>
              <div>Symptoms</div>
              <div className="text-white/35">All in one place</div>
            </div>
            <Image
              src="/redesign/spiral-arrow.webp"
              alt=""
              width={1536}
              height={1024}
              sizes="14vw"
              aria-hidden
              className="pointer-events-none mt-6 w-28 max-w-none select-none"
            />
          </div>

          {/* device frame — the screenshot already carries its own status
              bar and home indicator, so the frame only adds bezel + island */}
          <div className="relative mx-auto w-full max-w-[290px] rounded-[2.75rem] bg-black p-[9px] shadow-2xl ring-1 ring-white/15">
            <div className="relative overflow-hidden rounded-[2.25rem]">
              <Image
                src="/redesign/app-today.jpg"
                alt="The Daygo Today screen, showing readiness, recovery trend and the day's run"
                width={852}
                height={1846}
                sizes="(max-width: 768px) 80vw, 290px"
                priority
                className="w-full"
              />
              <div
                aria-hidden
                className="absolute left-1/2 top-[9px] h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-black"
              />
            </div>
          </div>

          {/* handwritten note + arrow, curving down toward the phone */}
          <Image
            src="/redesign/note-arrow.webp"
            alt="Your data. A clearer today."
            width={1219}
            height={1290}
            sizes="22vw"
            className="pointer-events-none absolute -bottom-6 -right-14 hidden w-[13rem] max-w-none select-none lg:block"
          />
        </div>
      </div>
    </section>
  );
}

/* ============================== FEATURES ============================== */

const FEATURES = [
  {
    title: "Sleep & recovery",
    desc: "Understand your sleep and get recommendations that fit your real life.",
    Icon: MoonIcon,
    Chart: SleepChart,
  },
  {
    title: "Training",
    desc: "See patterns, avoid overtraining and improve consistently.",
    Icon: DumbbellIcon,
    Chart: RunnerChart,
    // keeps its aspect ratio rather than stretching to the strip
    chartClass: "h-[70px] w-auto text-black",
  },
  {
    title: "Bloodwork",
    desc: "Turn your lab results into plain English and practical next steps.",
    Icon: DropIcon,
    Chart: LdlCompare,
    // The LDL card sets its own height rather than the shared 40px strip.
    chartClass: "w-full text-black/75",
  },
  {
    title: "AI insights",
    desc: "Daygo remembers what matters — and learns from your patterns over time.",
    Icon: BrainIcon,
    Chart: MemoryRecall,
    chartClass: "w-full text-black/75",
  },
];

function Features() {
  return (
    <section id="features" style={{ background: BONE }} className="text-black">
      <div className="mx-auto max-w-6xl px-6 pt-12 md:px-10">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-black/45">
          <span>Features</span>
          <span>01 — 04</span>
        </div>

        <div className="mt-8 flex flex-col gap-6 pb-12 md:flex-row md:items-center md:gap-10">
          <h2 className="text-[12vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[7vw] md:text-[3.7rem]">
            <span className="block whitespace-nowrap">Not Another</span>
            <span className="block">Tracker.</span>
            <span className="block whitespace-nowrap">A Coach.</span>
          </h2>
          <LongArrow className="hidden h-3 w-40 shrink-0 text-black/50 md:block" />
          <p className="max-w-xs text-[14px] leading-relaxed text-black/65">
            Daygo connects your data, adds context, and turns it into clear, personalized guidance you can actually
            follow.
          </p>
        </div>
      </div>

      <div className="grid border-y border-black/10 sm:grid-cols-2 md:grid-cols-4">
        {FEATURES.map((f, i) => (
          <div key={f.title} className={`flex flex-col px-6 py-9 md:px-8 ${i > 0 ? "border-black/10 sm:border-l" : ""}`}>
            <f.Icon className="mb-6 h-7 w-7" />
            <h3 className="text-[15px] font-bold">{f.title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-black/60">{f.desc}</p>
            {/* charts centre in the space left under the copy, so they sit
                on a common optical line whatever length each description is */}
            <div className="mt-8 flex flex-1 items-center">
              <f.Chart className={f.chartClass ?? "h-10 w-full text-black/75"} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================ MORE CONTEXT ============================ */

const SOURCES = ["Apple Health", "Bloodwork", "Symptoms", "Training", "Sleep", "Nutrition", "And more"];
const OUTPUTS = ["AI Analysis", "Pattern recognition", "Personalized guidance"];

function MoreContext() {
  return (
    <section className="grid md:grid-cols-2">
      {/* ---- dark half ---- */}
      <div className="relative flex min-h-[28rem] flex-col justify-end overflow-hidden bg-black px-6 py-12 text-white md:px-10 md:py-14">
        {/* flipped so the lit half of the face sits right and the copy below
            lands on the dark half */}
        <Image
          src="/redesign/portrait.jpg"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="scale-x-[-1] object-cover object-[42%_center]"
          priority={false}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 22%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 80%)" }}
        />
        <div className="relative z-10">
          <h2 className="text-[11vw] font-black uppercase leading-[0.86] tracking-tighter sm:text-[6vw] md:text-[3.4rem]">
            More
            <br />
            Context.
            <br />
            Better
            <br />
            Decisions.
          </h2>
          <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-white/70">
            Your data means more when it&apos;s connected. Daygo sees the bigger picture and helps you understand
            what&apos;s actually going on.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/50">
            <span>Data</span>
            <TinyArrow className="h-2 w-7" />
            <span>Context</span>
            <TinyArrow className="h-2 w-7" />
            <span>Insights</span>
            <TinyArrow className="h-2 w-7" />
            <span>Action</span>
          </div>
        </div>
      </div>

      {/* ---- lime half: wiring diagram ---- */}
      <div className="relative overflow-hidden px-6 py-14 text-black md:px-10 md:py-16" style={{ background: LIME }}>
        <div className="relative z-10 flex items-start justify-between font-mono text-[10px] uppercase tracking-widest text-black/55">
          <span>Multi-source data</span>
          <div className="text-right leading-relaxed">
            <div>// Seven sources</div>
            <div>// One timeline</div>
            <div>// Read together</div>
          </div>
        </div>

        <Crosshair className="absolute left-1/2 top-14 hidden h-10 w-10 -translate-x-1/2 text-black/30 md:block" />

        {/* Equal 1fr side columns keep the DAYGO box on the panel's centre
            line. Within each side the wiring is a flex-1 SVG, so it always
            spans exactly the gap between the labels and the box — no fixed
            widths to drift as the panel grows. */}
        <div className="relative z-10 mt-14 grid min-h-[13rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2">
          {/* sources + fan-in */}
          <div className="flex items-stretch gap-3">
            <div className="flex flex-col justify-between font-mono text-[9.5px] uppercase tracking-wider">
              {SOURCES.map((s) => (
                <div key={s} className="flex items-center gap-2.5">
                  <span className="h-[15px] w-px bg-black/60" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <FanIn className="min-w-[2rem] flex-1 text-black/45" />
          </div>

          {/* hub — lime fill so the wiring terminates at the box edge */}
          <span
            className="self-center border border-black/70 px-5 py-2.5 text-[13px] font-black tracking-tight"
            style={{ background: LIME }}
          >
            DAYGO
          </span>

          {/* fan-out + outputs, held to a narrower band than the 7 sources */}
          <div className="flex items-center">
            <div className="flex h-[62%] w-full items-stretch gap-3">
              <FanOut className="min-w-[2rem] flex-1 text-black/45" />
              <div className="flex flex-col justify-between font-mono text-[9.5px] uppercase tracking-wider">
                {OUTPUTS.map((o) => (
                  <div key={o}>{o}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* In flow rather than absolute, so it can't ride up over the content
            above it as its height scales with the panel width. Negative
            margin cancels the panel's bottom padding so it still bleeds off
            the edge. */}
        <Image
          src="/redesign/terrain-lime.webp"
          alt=""
          width={1600}
          height={533}
          sizes="(max-width: 768px) 100vw, 55vw"
          className="pointer-events-none relative z-0 -mb-14 mt-16 w-full select-none md:-mb-16"
        />
      </div>
    </section>
  );
}

/* ============================ TESTIMONIALS ============================ */

// No testimonials until there are real ones — this slot holds a factual
// description of the product instead of invented social proof.
const STEPS = [
  {
    n: "01",
    title: "Connect",
    body: "Link Apple Health and add your bloodwork, training and symptoms. It all lands in one place.",
  },
  {
    n: "02",
    title: "Understand",
    body: "Daygo reads it together, not in isolation, and explains what your numbers actually mean.",
  },
  {
    n: "03",
    title: "Act",
    body: "You get a clear call on what today needs — and Daygo remembers it tomorrow.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: BONE }} className="px-6 py-12 text-black md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-8">
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-black/45">
            How it works
            <br />
            Three steps
          </p>
          <LongArrow className="hidden h-3 w-44 text-black/40 sm:block" />
        </div>

        <div className="mt-8 grid sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`py-4 sm:px-7 ${i > 0 ? "sm:border-l sm:border-black/10" : ""}`}>
              <div className="font-mono text-[10px] tracking-widest text-black/40">{s.n}</div>
              <h3 className="mt-2 text-[15px] font-bold">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-black/65">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================= SMALL STEPS ============================= */

function SmallSteps() {
  return (
    <section style={{ background: BONE }} className="px-6 py-16 text-black md:px-10 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <h2 className="text-[15vw] font-black uppercase leading-[0.84] tracking-tighter sm:text-[8vw] md:text-[4.8rem]">
          <span className="block">Small</span>
          <span className="block">Steps</span>
          <span className="relative block w-fit">
            <Image
              src="/redesign/highlight.webp"
              alt=""
              width={1400}
              height={468}
              sizes="60vw"
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[310%] w-[118%] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-2 select-none"
            />
            <span className="relative z-10">A Brighter</span>
          </span>
          <span className="block">You.</span>
        </h2>

        <Image
          src="/redesign/summit-collage.webp"
          alt="A figure standing on a summit"
          width={1400}
          height={933}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full"
        />
      </div>

      {/* centred on the section, not on either column */}
      <div className="mt-14 flex items-start justify-center gap-4">
        <Crosshair className="h-12 w-12 shrink-0 border border-black/25 p-2 text-black/60" />
        <div className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-black/55">
          54.6872° N
          <br />
          25.2797° E
          <br />
          /
          <br />
          A clearer you
        </div>
      </div>
    </section>
  );
}

/* =============================== PRICING =============================== */

// Prices mirror Daygo.storekit exactly: annual $99/yr with a 2-week free
// trial, weekly $4.99 with none. Both tiers unlock the same features, so
// no feature is listed as annual-only.
const ANNUAL_FEATURES = [
  { label: "AI coaching that remembers you", Icon: BrainIcon },
  { label: "Daily plan from sleep, training and labs", Icon: BarsIcon },
  { label: "Lab markers read from a photo", Icon: DropIcon },
  { label: "Patterns across logs, labs and symptoms", Icon: PulseIcon },
];

// Deliberately facts we can stand behind rather than usage numbers or a
// star rating — the app is new and any figure here would be invented.
const ASSURANCES = [
  { title: "14-day free trial", note: "No charge for 14 days", Icon: ClockIcon },
  { title: "Cancel anytime", note: "In your App Store settings", Icon: ShieldIcon },
  { title: "Never used to train AI", note: "Your data stays yours", Icon: LockIcon },
];

function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-black px-6 py-20 text-white md:px-10 md:py-24">
      {/* Runner sits along the bottom edge and is faded into black upward, so
          it reads as the floor of the section without touching card contrast. */}
      <Image
        src="/redesign/runner-summit.jpg"
        alt=""
        width={1672}
        height={941}
        sizes="100vw"
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[65%] w-full select-none object-cover object-bottom"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          // Heavy at the very bottom so the assurance bar and fine print stay
          // legible, lighter through the middle where the runner should read.
          background:
            "linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.86) 14%, rgba(0,0,0,0.52) 30%, rgba(0,0,0,0.88) 58%, #000 78%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* ---- left: pitch ---- */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">Pricing</p>

            <h2 className="mt-7 text-[12vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[7vw] lg:text-[3.6rem]">
              <span className="block">Start free.</span>
              <span className="block">Decide in</span>
              <span className="relative block w-fit" style={{ color: LIME }}>
                <span className="relative z-10">two weeks.</span>
                <Underline className="absolute -bottom-2 left-0 h-3 w-full" />
              </span>
            </h2>

            <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-white/65">
              Get full access for 14 days. See what your data actually says, build the habit, and decide after —
              not before.
            </p>

            <div className="mt-10 flex items-start gap-3 border-l border-white/15 pl-4">
              <p className="max-w-[15rem] font-mono text-[10px] uppercase leading-relaxed tracking-widest text-white/45">
                Independent, built in Lithuania. No ads, no data resold.
              </p>
            </div>

            {/* sits in the bottom-left corner, over the runner */}
            <Image
              src="/redesign/better-data-note.webp"
              alt="Better data. Brighter days."
              width={800}
              height={533}
              sizes="30vw"
              className="pointer-events-none mt-14 hidden w-56 max-w-none select-none lg:block"
            />
          </div>

          {/* ---- right: plans ---- */}
          <div>
            <div className="grid gap-5 sm:grid-cols-2">
              {/* annual */}
              <div
                className="flex flex-col rounded-2xl border p-7"
                style={{ borderColor: LIME, background: "rgba(205,238,60,0.04)" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-black"
                    style={{ background: LIME }}
                  >
                    Most popular
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">Annual</span>
                </div>

                <div className="mt-7 flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter">$99</span>
                  <span className="text-[15px] text-white/55">/ year</span>
                </div>
                <p className="mt-2 text-[13.5px] text-white/70">14-day free trial, then $99/year.</p>

                <ul className="mt-7 space-y-3.5 border-t border-white/10 pt-7">
                  {ANNUAL_FEATURES.map((f) => (
                    <li key={f.label} className="flex items-start gap-3 text-[13.5px] leading-snug text-white/85">
                      <f.Icon className="mt-px h-4 w-4 shrink-0" style={{ color: LIME }} />
                      <span>{f.label}</span>
                    </li>
                  ))}
                </ul>

                {/* pt- gives a guaranteed gap above the CTA; mt-auto alone
                    collapses it once the feature list grows tall */}
                <div className="mt-auto pt-9">
                  <a
                    href={APP_STORE_URL}
                    style={{ background: LIME }}
                    className="flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[14px] font-semibold text-black transition hover:opacity-90"
                  >
                    <AppleMark className="h-[18px] w-[18px]" />
                    Start 14-day free trial
                  </a>
                  <p className="mt-3 text-center text-[11.5px] text-white/45">Renews annually. Cancel anytime.</p>
                </div>
              </div>

              {/* weekly */}
              <div className="flex flex-col rounded-2xl border border-white/15 p-7">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">Weekly</span>

                <div className="mt-7 flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter">$4.99</span>
                  <span className="text-[15px] text-white/55">/ week</span>
                </div>
                <p className="mt-2 text-[13.5px] text-white/70">Same features, billed weekly. No trial.</p>

                <ul className="mt-7 space-y-3.5 border-t border-white/10 pt-7">
                  {["Everything in Annual", "Cancel any week"].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[13.5px] leading-snug text-white/85">
                      <CheckIcon className="mt-px h-4 w-4 shrink-0 text-white/60" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-9">
                  <a
                    href={APP_STORE_URL}
                    className="flex items-center justify-center gap-2.5 rounded-full border border-white/25 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-white/10"
                  >
                    <AppleMark className="h-[18px] w-[18px]" />
                    Get started
                  </a>
                  <p className="mt-3 text-center text-[11.5px] text-white/45">Billed weekly. Cancel anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- assurance bar ---- */}
        <div className="mt-16 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
          {ASSURANCES.map((a, i) => (
            <div
              key={a.title}
              // outer two hug the edges, middle one centres — so the middle
              // item sits on the section's centre line, not a third of the way in
              className={`flex items-center gap-3 ${
                i === 1 ? "sm:justify-center" : i === 2 ? "sm:justify-end" : ""
              }`}
            >
              <a.Icon className="h-5 w-5 shrink-0" style={{ color: LIME }} />
              <div>
                <div className="text-[13.5px] font-bold">{a.title}</div>
                <div className="font-mono text-[9.5px] uppercase tracking-widest text-white/45">{a.note}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[12px] leading-relaxed text-white/45">
          Subscriptions are billed through the App Store and can be cancelled any time in your iPhone&apos;s
          subscription settings. Daygo is a wellbeing tool, not a medical device, and nothing in it is medical advice.
        </p>
      </div>
    </section>
  );
}

/* ================================= FAQ ================================= */

const FAQS = [
  {
    q: "What do I need to start?",
    a: "An iPhone. Connecting Apple Health makes Daygo far more useful, but you can type things in by hand and still get a plan.",
  },
  {
    q: "Can I try it before paying?",
    a: "Yes. The annual plan starts with a 14-day free trial, and you can send a few chat messages before subscribing at all.",
  },
  {
    q: "What happens to my bloodwork?",
    a: "You photograph a results page and Daygo reads the markers from it, so you get plain-English context instead of a number with no meaning attached.",
  },
  {
    q: "Is this medical advice?",
    a: "No. Daygo is a wellbeing tool, not a medical device. It can help you spot patterns and ask better questions, but it does not diagnose anything — talk to a clinician about anything that concerns you.",
  },
  {
    q: "How do I cancel?",
    a: "In your iPhone's subscription settings, the same place as every other App Store subscription. Cancelling there stops the renewal immediately.",
  },
];

function Faq() {
  return (
    <section id="faq" style={{ background: BONE }} className="px-6 py-20 text-black md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-black/45">
          <span>FAQ</span>
          <span>01 — 0{FAQS.length}</span>
        </div>

        <h2 className="mt-8 text-[12vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[7vw] md:text-[3.7rem]">
          Questions,
          <br />
          answered straight.
        </h2>

        <div className="mt-14 border-t border-black/10">
          {FAQS.map((f, i) => (
            <div key={f.q} className="grid gap-3 border-b border-black/10 py-7 md:grid-cols-[3rem_1fr_1.1fr] md:gap-8">
              <div className="font-mono text-[10px] tracking-widest text-black/35">0{i + 1}</div>
              <h3 className="text-[17px] font-bold leading-snug">{f.q}</h3>
              <p className="text-[14px] leading-relaxed text-black/65">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== FINAL CTA ============================== */

function FinalCTA() {
  return (
    <section className="bg-black px-6 py-16 text-white md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 md:flex-row md:items-center">
        <h2 className="text-[10vw] font-black uppercase leading-[0.88] tracking-tighter sm:text-[6vw] md:text-[3.3rem]">
          Ready to
          <br />
          Take Control?
        </h2>

        <a
          href={APP_STORE_URL}
          style={{ background: LIME }}
          className="flex items-center gap-3 rounded-full px-8 py-4 text-[14px] font-semibold text-black transition hover:opacity-90"
        >
          <AppleMark className="h-[18px] w-[18px]" />
          Download on the App Store
          <LongArrow className="h-3 w-7" />
        </a>

        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-white/25 text-center font-mono text-[10px] uppercase leading-relaxed tracking-widest text-white/70">
          Better
          <br />
          Data
          <br />
          Brighter
          <br />
          Days
        </div>
      </div>
    </section>
  );
}

/* ====================== INLINE GRAPHICS (no assets) ====================== */

function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}


function LongArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 10" fill="none" stroke="currentColor" strokeWidth="1" className={className} preserveAspectRatio="none" aria-hidden>
      <path d="M0 5h116M110 1l6 4-6 4" />
    </svg>
  );
}

function TinyArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 8" fill="none" stroke="currentColor" strokeWidth="1" className={className} preserveAspectRatio="none" aria-hidden>
      <path d="M0 4h26M22 1l4 3-4 3" />
    </svg>
  );
}

function Crosshair({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" className={className} aria-hidden>
      <circle cx="20" cy="20" r="9" />
      <path d="M20 0v40M0 20h40" />
    </svg>
  );
}

// The two fans are separate SVGs, each stretched across the gap its own
// flex slot measures out. Endpoints sit where the labels actually are:
// 7 sources spread over the full height, 3 outputs over a narrower band,
// both distributed by `justify-between` to match these y values.
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.5 14.3A9.2 9.2 0 1 1 10.2 2.6a7.4 7.4 0 0 0 11.3 11.7z" />
    </svg>
  );
}

function DumbbellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <rect x="1" y="9.5" width="3" height="5" rx="1" />
      <rect x="20" y="9.5" width="3" height="5" rx="1" />
      <rect x="4.8" y="7" width="3.4" height="10" rx="1.2" />
      <rect x="15.8" y="7" width="3.4" height="10" rx="1.2" />
      <rect x="8.2" y="11" width="7.6" height="2" />
    </svg>
  );
}

function DropIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} style={style} aria-hidden>
      <path d="M12 3.2s6.6 7.3 6.6 11.6a6.6 6.6 0 0 1-13.2 0C5.4 10.5 12 3.2 12 3.2z" />
    </svg>
  );
}

function BrainIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden>
      <path d="M11 3.5a2.6 2.6 0 0 0-2.6 2.6 2.7 2.7 0 0 0-2 4.5 2.7 2.7 0 0 0 1.5 4.8A2.7 2.7 0 0 0 11 20V3.5zM13 3.5a2.6 2.6 0 0 1 2.6 2.6 2.7 2.7 0 0 1 2 4.5 2.7 2.7 0 0 1-1.5 4.8A2.7 2.7 0 0 1 13 20V3.5z" />
      <path d="M11 8H8.5M11 13H7.8M13 8h2.5M13 13h3.2" />
    </svg>
  );
}




function Underline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 12" fill="none" className={className} preserveAspectRatio="none" aria-hidden>
      <path d="M2 8c38-6 70-7 196-4" stroke={LIME} strokeWidth="3" strokeLinecap="round" />
      <path d="M8 11c40-5 78-6 180-3" stroke={LIME} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}


function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden>
      <path d="M4 12.5l5.5 5.5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarsIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden>
      <rect x="3" y="13" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="13" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

function PulseIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style} aria-hidden>
      <path d="M2 12h4l3-8 4 16 3-8h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} style={style} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} style={style} aria-hidden>
      <path d="M12 3l7.5 3v6c0 4.5-3 7.8-7.5 9-4.5-1.2-7.5-4.5-7.5-9V6L12 3z" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} style={style} aria-hidden>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}
