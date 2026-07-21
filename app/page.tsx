"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AnimatedChat } from "@/components/AnimatedChat";
import {
  ChatMock,
  IntentMock,
  CompareMock,
  CaffeineMock,
  TravelMock,
  LabScanMock,
} from "@/components/DaygoMock";
import { PhoneMock } from "@/components/PhoneMock";

// Lime = #CDEE3C, Ink = #161913 — matches iOS lime theme exactly
const LIME = "#CDEE3C";
const INK = "#161913";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="overflow-x-hidden">
        <Hero />
        <Audience />
        <Moments />
        <LabsShowcase />
        <SleepSection />
        <AccountabilityShowcase />
        <CustomizeShowcase />
        <WhyDaygo />
        <PrivacyPanel />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

/* =================================================================
 * HERO — question-as-headline + mocked Today card + floating data
 * stickers in brand colors. Same color-blocking energy as the
 * Moments section so the page feels coherent top-to-bottom.
 * =================================================================*/
function Hero() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden lime-surface">
      {/* Editorial grid — dark hairlines on lime */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(22,25,19,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(22,25,19,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Crosshair markers */}
      {[
        { top: "96px", left: "28px" },
        { top: "96px", right: "28px" },
        { top: "360px", left: "28px" },
        { bottom: "96px", left: "28px" },
        { bottom: "96px", right: "28px" },
      ].map((pos, i) => (
        <div key={i} className="pointer-events-none absolute z-20 select-none" style={{ ...pos }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <line x1="7" y1="0" x2="7" y2="14" stroke={`${INK}`} strokeOpacity="0.2" strokeWidth="0.75" />
            <line x1="0" y1="7" x2="14" y2="7" stroke={`${INK}`} strokeOpacity="0.2" strokeWidth="0.75" />
          </svg>
        </div>
      ))}

      {/* Bottom data strip */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t px-8 py-3"
        style={{ borderColor: `${INK}22` }}
      >
        <div className="flex items-center gap-6">
          {["Sleep", "Training", "Recovery", "Bloodwork"].map((label) => (
            <span key={label} className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: `${INK}88` }}>
              <span className="block h-1.5 w-1.5 rounded-full" style={{ background: INK }} />
              {label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em]" style={{ color: `${INK}66` }}>
          YOUR DATA STAYS ON YOUR DEVICE
        </div>
      </div>

      {/* Large background wordmark */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-end justify-end overflow-hidden select-none">
        <span
          className="leading-none font-black"
          style={{
            fontSize: "clamp(12rem, 38vw, 42rem)",
            letterSpacing: "-0.06em",
            lineHeight: 0.85,
            color: `${INK}12`,
            transform: "translateX(8%) translateY(12%)",
          }}
        >
          DG
        </span>
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 md:pt-36">
        <div className="grid items-center gap-12 md:grid-cols-[1.05fr_minmax(0,500px)] md:gap-16">
          {/* LEFT */}
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="block h-1.5 w-1.5 rounded-full" style={{ background: INK }} />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: `${INK}88` }}>
                AI Health Coach
              </span>
              <span className="h-px w-16" style={{ background: `${INK}33` }} />
            </div>

            <h1 className="font-medium leading-[0.94] tracking-[-0.04em]" style={{ color: INK }}>
              <span className="block text-[clamp(3rem,8.5vw,8rem)]">What should I</span>
              <span className="block text-[clamp(3rem,8.5vw,8rem)]">
                <span className="italic" style={{ color: `${INK}cc` }}>do</span> today?
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed md:text-xl" style={{ color: `${INK}bb` }}>
              Daygo answers — using your sleep, training, and bloodwork.{" "}
              <span style={{ color: INK }}>One AI coach. Plain English. Remembers what worked.</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3" id="download">
              <a
                href="#download"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90"
                style={{ background: INK, color: LIME }}
              >
                Get the app
                <span aria-hidden>→</span>
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition"
                style={{ border: `1.5px solid ${INK}44`, color: `${INK}cc` }}
              >
                See it work
              </a>
              <span className="text-xs" style={{ color: `${INK}66` }}>Free · iOS only</span>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex flex-wrap items-center gap-2">
              {[
                { label: "HRV", value: "52ms" },
                { label: "SLEEP", value: "7h 20m" },
                { label: "LDL", value: "↓18 pts" },
                { label: "iOS ONLY", value: "On-device" },
              ].map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[10px] tracking-[0.12em]"
                  style={{ borderColor: `${INK}33`, color: `${INK}99`, background: `${INK}08` }}
                >
                  <span style={{ color: `${INK}66` }}>{b.label}</span>
                  <span style={{ opacity: 0.3 }}>·</span>
                  {b.value}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

/**
 * The hero's right-column visual: a 3D-tilted iPhone showing the
 * Daygo app cycling through Today → Coach → Labs → Week, with two
 * floating data-sticker badges in brand colors orbiting it.
 */
function HeroVisual() {
  return (
    <div className="relative mx-auto flex w-full max-w-[480px] items-center justify-center py-6">
      {/* Soft DARK halo behind the phone — gives the device figure-ground
          separation from the lime hero so it reads as a floating object,
          not lime-on-lime. */}
      <div
        className="absolute inset-0 -z-10 rounded-[60px] opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(22,25,19,0.45), rgba(22,25,19,0.12) 60%, transparent 82%)",
        }}
      />

      {/* The phone */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <PhoneMock />
      </motion.div>

      {/* Floating badge — HRV, ink on lime */}
      <motion.div
        initial={{ opacity: 0, y: -8, rotate: 8 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-[-16px] top-4 z-20 hidden sm:block"
        style={{
          background: INK,
          borderRadius: "10px",
          padding: "10px 14px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div className="font-mono text-[8px] tracking-[0.22em] uppercase" style={{ color: `${LIME}66` }}>HRV(ms)</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[26px] font-black leading-none tracking-tight" style={{ color: LIME }}>52</span>
          <span className="font-mono text-[10px] tracking-wide text-red-400">↓12%</span>
        </div>
        <div className="mt-2 flex gap-1">
          {["BELOW-AVG", "LOW-STRAIN"].map((t) => (
            <span key={t} className="rounded-sm px-1.5 py-0.5 font-mono text-[7px] tracking-[0.1em]"
              style={{ border: `1px solid ${LIME}30`, color: `${LIME}60` }}>{t}</span>
          ))}
        </div>
      </motion.div>

      {/* Floating badge — LDL, lime on ink */}
      <motion.div
        initial={{ opacity: 0, y: 8, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -5 }}
        transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-4 right-[-16px] z-20 hidden sm:block"
        style={{
          background: LIME,
          borderRadius: "10px",
          padding: "10px 14px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        }}
      >
        <div className="font-mono text-[8px] tracking-[0.22em] uppercase" style={{ color: `${INK}88` }}>LDL · 6mo</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[26px] font-black leading-none tracking-tight" style={{ color: INK }}>124</span>
          <span className="font-mono text-[10px] tracking-wide" style={{ color: INK }}>↓18</span>
        </div>
        <div className="mt-2 flex gap-1">
          {["mg/dL", "IMPROVING"].map((t) => (
            <span key={t} className="rounded-sm border px-1.5 py-0.5 font-mono text-[7px] tracking-[0.1em]"
              style={{ borderColor: `${INK}33`, color: `${INK}88` }}>{t}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* =================================================================
 * AUDIENCE — picks a side, fast
 * =================================================================*/
function Audience() {
  return (
    <section className="relative border-t border-white/[0.06] bg-black/30">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <h2 className="text-3xl font-medium leading-tight tracking-display md:text-5xl">
          You wear the watch. You log the food.{" "}
          <span className="text-white/55">You still don&apos;t know if today is the day to push.</span>
        </h2>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          Daygo isn&apos;t another dashboard. It reads your sleep, your
          training load, your blood work, and what you told it last
          week — then answers the only question that matters: what
          should I do today?
        </p>
      </div>
    </section>
  );
}

/* =================================================================
 * SIX MOMENTS — color-blocked cards with mocked Daygo iOS UI inside
 *
 * Each card has its own bold background color (no dynamic spotlight).
 * The mocked UI is the hero of the card — body copy is a short label
 * underneath. Sizes vary across the 3-col grid to break the rectangle
 * monotony.
 * =================================================================*/
function Moments() {
  return (
    <section
      id="features"
      className="relative border-t border-white/[0.06]"
    >
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
        <SectionLabel>Six moments</SectionLabel>
        <h2 className="mt-8 max-w-3xl text-4xl font-medium leading-[1.05] tracking-display md:text-5xl">
          The kind of thing your friend with a sports-medicine degree
          would notice.{" "}
          <span className="text-white/55">Without the friend.</span>
        </h2>

        <div className="mt-16 grid auto-rows-min gap-3 md:mt-20 md:grid-cols-3">
          {/* 01 — Chat (lime hero, spans 2 cols) */}
          <ColorCard
            n="01"
            kicker="Coaching"
            title="Skip the intervals."
            tone="lime"
            className="md:col-span-2"
          >
            <ChatMock />
          </ColorCard>

          {/* 02 — Weekly intent */}
          <ColorCard
            n="02"
            kicker="Accountability"
            title="Sunday. Set the week."
            tone="ink-lime"
          >
            <IntentMock />
          </ColorCard>

          {/* 03 — Biomarker compare (cream / off-white) */}
          <ColorCard
            n="03"
            kicker="Long memory"
            title="−18 LDL. Six months."
            tone="cream"
          >
            <CompareMock />
          </ColorCard>

          {/* 04 — Caffeine warning (near-black) */}
          <ColorCard
            n="04"
            kicker="Real-time"
            title="9pm. The fourth coffee."
            tone="ink"
          >
            <CaffeineMock />
          </ColorCard>

          {/* 05 — Travel timezone */}
          <ColorCard
            n="05"
            kicker="Travel"
            title="Touch down. Reset."
            tone="ink-lime"
          >
            <TravelMock />
          </ColorCard>

          {/* 06 — Lab scan (full-width marquee) */}
          <ColorCard
            n="06"
            kicker="Lab import"
            title="Photograph the PDF. 14 markers, 4 seconds."
            tone="ink"
            className="md:col-span-3"
          >
            <LabScanMock />
          </ColorCard>
        </div>
      </div>
    </section>
  );
}

// Tones: lime (hero), ink (dark), ink-lime (dark with lime edge), cream (off-white)
type CardTone = "lime" | "ink" | "ink-lime" | "cream";

function ColorCard({
  n,
  kicker,
  title,
  tone,
  className = "",
  children,
}: {
  n: string;
  kicker: string;
  title: string;
  tone: CardTone;
  className?: string;
  children: React.ReactNode;
}) {
  const palette: Record<CardTone, { bg: string; text: string; kickerText: string; badge: string; ring: string }> = {
    lime: {
      bg: "bg-accent",
      text: "text-accent-on",
      kickerText: "text-accent-on/55",
      badge: "bg-accent-on text-accent",
      ring: "ring-accent-on/10",
    },
    ink: {
      bg: "bg-bg-elevated",
      text: "text-white",
      kickerText: "text-white/45",
      badge: "border border-white/15 bg-black/40 text-white/75",
      ring: "ring-white/[0.08]",
    },
    "ink-lime": {
      bg: "bg-surface",
      text: "text-white",
      kickerText: "text-white/45",
      badge: "bg-accent/15 text-accent border border-accent/20",
      ring: "ring-accent/10",
    },
    cream: {
      bg: "bg-[#EFE9DC]",
      text: "text-black",
      kickerText: "text-black/50",
      badge: "bg-black/85 text-[#EFE9DC]",
      ring: "ring-black/10",
    },
  };
  const p = palette[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col overflow-hidden rounded-3xl p-6 ring-1 ${p.bg} ${p.text} ${p.ring} ${className}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div
          className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold ${p.badge}`}
        >
          {n}
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${p.kickerText}`}
        >
          {kicker}
        </span>
      </div>

      <div className="flex-1">{children}</div>

      <h3 className="mt-6 text-lg font-semibold leading-tight tracking-tight md:text-xl">
        {title}
      </h3>
    </motion.div>
  );
}

/* =================================================================
 * COACH SHOWCASE — the animated chat is the centerpiece
 * =================================================================*/
function CoachShowcase() {
  return (
    <section className="relative border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-32">
        <div>
          <SectionLabel>The coach</SectionLabel>
          <h2 className="mt-8 text-4xl font-medium leading-[1.05] tracking-display md:text-6xl">
            It actually
            <br />
            <span className="text-accent">
              talks back.
            </span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
            Watch a real Tuesday-morning conversation. The kind your
            phone has had a thousand times — except this one ends with
            the right answer.
          </p>
        </div>
        <AnimatedChat />
      </div>
    </section>
  );
}

/* =================================================================
 * LAB WORK
 * =================================================================*/
function LabsShowcase() {
  return (
    <section className="relative border-t border-white/[0.06]">
      <div className="relative mx-auto grid max-w-7xl items-start gap-14 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-32">
        <div>
          <SectionLabel>Blood work</SectionLabel>
          <h2 className="mt-8 text-4xl font-medium leading-[1.05] tracking-display md:text-6xl">
            Photograph the PDF.{" "}
            <span className="text-accent">We'll do the rest.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
            Your last lab report is sitting in an email. We'll read
            every value, color-code against your previous test, and
            tell you in plain English what changed and whether it
            matters. ApoB went up. HDL is climbing. HbA1c is finally
            back in range. That kind of read.
          </p>
        </div>
        <LabsMock />
      </div>
    </section>
  );
}

function LabsMock() {
  const markers = [
    { name: "LDL", v: "142 mg/dL", trend: "up", tone: "bad" },
    { name: "HDL", v: "58 mg/dL", trend: "up", tone: "good" },
    { name: "HbA1c", v: "5.4 %", trend: "down", tone: "good" },
    { name: "Vitamin D", v: "38 ng/mL", trend: "up", tone: "good" },
    { name: "ApoB", v: "92 mg/dL", trend: "up", tone: "bad" },
    { name: "Ferritin", v: "118 ng/mL", trend: "flat", tone: "neutral" },
  ] as const;
  return (
    <div className="card-glass rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
          What&apos;s changed
        </div>
        <div className="text-[10px] text-white/40">Mar 12 → Today</div>
      </div>
      <div className="space-y-2">
        {markers.map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-bg-elevated px-4 py-3"
          >
            <div className="text-sm font-medium">{m.name}</div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/85">{m.v}</span>
              <span
                className="text-xs font-semibold"
                style={{
                  color:
                    m.tone === "good"
                      ? "var(--color-accent)"
                      : m.tone === "bad"
                        ? "var(--color-bad)"
                        : "rgba(255,255,255,0.45)",
                }}
              >
                {m.trend === "up" ? "↑" : m.trend === "down" ? "↓" : "—"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =================================================================
 * SLEEP / strain — tightened
 * =================================================================*/
function SleepSection() {
  return (
    <section className="relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
        <div className="grid gap-16 md:grid-cols-[0.5fr_1fr] md:gap-24">
          <SectionLabel>Sleep & recovery</SectionLabel>
          <div>
            <h2 className="text-4xl font-medium leading-tight tracking-display md:text-6xl">
              The math you stop doing.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65">
              Caffeine half-life. Bedtime cushion. Travel-mode
              circadian shift. HR zones from your last run. Sleep
              debt across the week. We do the calculation; you get
              the call.
            </p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14 overflow-hidden rounded-[28px] border border-white/10 shadow-2xl shadow-black/60 md:mt-20"
        >
          <Image
            src="/photo-sleep.png"
            alt="A phone glowing on a nightstand at dawn — sleep dashboard"
            width={2752}
            height={1536}
            className="h-auto w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* =================================================================
 * ACCOUNTABILITY — kept, copy tightened
 * =================================================================*/
function AccountabilityShowcase() {
  return (
    <section className="relative border-t border-white/[0.06] bg-black/30">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-32">
        <div className="card-glass rounded-3xl p-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
            This week
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { text: "In bed by 22:30 every weekday", time: "10:00 PM · weekdays" },
              { text: "No caffeine after 1pm", time: "1:00 PM · every day" },
              { text: "4 lifts and 2 runs", time: null },
            ].map((c) => (
              <div key={c.text}>
                <div className="font-medium text-white">{c.text}</div>
                {c.time && (
                  <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
                    🔔 {c.time}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-white/10 bg-bg-elevated p-3 text-sm text-white/75">
            “You said you&apos;d be in bed by 22:30 — that&apos;s
            slipped twice this week. What got in the way?”
          </div>
        </div>
        <div>
          <SectionLabel>Accountability</SectionLabel>
          <h2 className="mt-8 text-4xl font-medium leading-[1.05] tracking-display md:text-6xl">
            Your word for the week.{" "}
            <span className="text-accent">Held to it.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
            Sunday night you write three things you&apos;re holding
            yourself to. Daygo schedules the reminders. Notices
            mid-week if you&apos;ve slipped. Walks you through it on
            Sunday. Never preachy.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
 * CUSTOMIZE — short
 * =================================================================*/
function CustomizeShowcase() {
  return (
    <section className="relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
        <div className="grid gap-16 md:grid-cols-[0.5fr_1fr] md:gap-24">
          <SectionLabel>Yours to shape</SectionLabel>
          <div>
            <h2 className="text-4xl font-medium leading-[1.05] tracking-display md:text-6xl">
              The dashboard person and the &quot;just tell me&quot;
              person —{" "}
              <span className="text-accent">
                both happy.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65">
              Long-press anything to remove it. Pin only what you
              want. Or tell the chat to do it: <em>&quot;set my
              calorie target to 2,000&quot;</em> — done.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
 * WHY DAYGO — founder voice
 * =================================================================*/
function WhyDaygo() {
  return (
    <section className="relative border-t border-white/[0.06] bg-black/30">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 md:py-28">
        <SectionLabel>Why Daygo</SectionLabel>
        <h2 className="mt-8 text-3xl font-medium leading-[1.15] tracking-display md:text-4xl">
          Built by someone who tracked everything for two years and{" "}
          <span className="text-white/50">still didn&apos;t know what to do on a Tuesday.</span>
        </h2>
        <p className="mt-8 text-base leading-relaxed text-white/70 md:text-lg">
          Daygo started after the realization that the missing thing
          wasn&apos;t more data. It was a coach who reads your data
          and tells you the answer — in plain English, with memory
          of what worked last month and the discipline to ask about
          it next week.
        </p>
        <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
          We&apos;re not an analytics company. We&apos;re trying to
          make a coach worth paying for.
        </p>
        <div className="mt-8 text-sm text-white/55">
          — Marijus, founder
        </div>
      </div>
    </section>
  );
}

/* =================================================================
 * TESTIMONIALS — placeholder cards (replace with real once you have them)
 * =================================================================*/
/* =================================================================
 * PRIVACY — kept, tightened
 * =================================================================*/
function PrivacyPanel() {
  return (
    <section className="relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="grid gap-16 md:grid-cols-[0.5fr_1fr] md:gap-24">
          <SectionLabel>Privacy</SectionLabel>
          <h2 className="text-4xl font-medium leading-tight tracking-display md:text-5xl">
            Your data stays yours.
          </h2>
        </div>
        <div className="mt-12 grid gap-3 md:grid-cols-3">
          <Feature
            title="On-device by default"
            body="Logs, journals, labs live on your phone. Cloud sync is opt-in."
          />
          <Feature
            title="No training, no ads, no tracking"
            body="AI calls go to Anthropic with explicit no-training terms. We don't sell, share, or build a profile of you."
          />
          <Feature
            title="Pay or leave"
            body="Daygo doesn't make money from your data. Only from people who pay for the app."
          />
        </div>
      </div>
    </section>
  );
}

/* =================================================================
 * PRICING — free during early access, no paywall yet
 * =================================================================*/
function Pricing() {
  return (
    <section
      id="pricing"
      className="relative border-t border-white/[0.06] bg-black/30"
    >
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 md:py-32">
        <SectionLabel center>Free, for now</SectionLabel>
        <h2 className="mt-8 text-4xl font-medium leading-tight tracking-display md:text-6xl">
          Free while it's early.
          <br />
          No card, no catch.
        </h2>
        <div className="card-glass-strong mt-12 rounded-3xl p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            Daygo
          </div>
          <div className="mt-3 text-4xl font-medium tracking-display md:text-6xl">
            Free
          </div>
          <div className="mt-2 text-sm text-white/55">
            Built and run by one person — I'd rather have real users
            than a paywall right now.
          </div>
          <ul className="mx-auto mt-8 max-w-md space-y-3 text-left text-sm">
            {[
              "AI coaching, with memory",
              "Daily plans from your sleep, training, and labs",
              "Lab markers — photo + AI parser",
              "Pattern detection across logs and labs",
              "Running plans that adjust when you ask",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-accent/15 text-[10px] font-bold text-accent">
                  ✓
                </span>
                <span className="text-white/85">{f}</span>
              </li>
            ))}
          </ul>
          <a
            href="#download"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-on transition hover:opacity-90"
          >
            Get the app →
          </a>
          <p className="mt-4 text-xs text-white/45">
            Daygo is new and improving every week. Daygo is a
            wellbeing tool, not medical advice.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
 * FINAL CTA
 * =================================================================*/
function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06]">
      {/* Dawn-trail backdrop. Gradient overlay keeps the type
          legible while the warm forest light bleeds through behind.
          z-0 (not -z-10) — negative z stacks the image behind the
          page's body background and renders solid black. */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-runner.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-80"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.30) 35%, rgba(0,0,0,0.30) 65%, rgba(0,0,0,0.85) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 py-28 text-center sm:px-8 md:py-40">
        <h2 className="font-medium leading-[0.92] tracking-display">
          <span className="block text-[clamp(2.5rem,9vw,8rem)]">
            Tomorrow morning,
          </span>
          <span className="block text-[clamp(2.5rem,9vw,8rem)] text-accent">
            you'll know.
          </span>
        </h2>
        <a
          href="#download"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-on transition hover:opacity-90"
        >
          Get the app — it's free →
        </a>
        <p className="mt-4 text-xs text-white/55">
          No card needed. iOS only, for now.
        </p>
      </div>
    </section>
  );
}

/* =================================================================
 * Shared
 * =================================================================*/
function SectionLabel({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={`text-[11px] font-semibold uppercase tracking-[0.3em] text-white/45 ${center ? "mx-auto" : ""}`}
    >
      <span className="inline-flex items-center gap-2">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: 24 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="block h-1 bg-accent"
        />
        {children}
      </span>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="card-glass rounded-3xl p-7">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/65">{body}</p>
    </div>
  );
}
