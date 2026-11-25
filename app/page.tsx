import Image from "next/image";
import { Bodoni_Moda } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SleepChart, RunnerChart, LdlCompare, MemoryRecall } from "@/components/FeatureCharts";
import { APP_STORE_URL, BONE, LIME } from "@/lib/brand";
import { HeroHeadline } from "@/components/HeroHeadline";
import { Editorial, EditorialFeatures } from "@/components/Editorial";
import { ClinicGlass, FounderCTA } from "@/components/GlassSections";
import { IntroLoader } from "@/components/IntroLoader";
import { SceneMotion } from "@/components/SceneMotion";
import { ElasticDivider } from "@/components/Motion";

// The marketing home page. Chrome (nav/footer) and brand tokens are shared
// with the legal, support and labs pages so the site reads as one thing.

// Tells search and AI answer engines what Daygo is: an iPhone app, free to
// download, from the Daygo organisation.
const appJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MobileApplication",
      name: "Daygo",
      operatingSystem: "iOS",
      applicationCategory: "HealthApplication",
      description:
        "An AI health coach that remembers you, built on your sleep, training, food and lab work.",
      url: "https://daygo.ai",
      downloadUrl: APP_STORE_URL,
      installUrl: APP_STORE_URL,
      sameAs: [APP_STORE_URL],
      featureList: [
        "AI health coach chat that remembers your goals and history",
        "Sleep, HRV and resting heart rate from Apple Health",
        "Blood test reading: photograph results, get plain-English context",
        "Running plans and daily recommendations",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "Organization",
      name: "Daygo",
      url: "https://daygo.ai",
      logo: "https://daygo.ai/logo.png",
      email: "hello@daygo.ai",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <IntroLoader />
      <SceneMotion />
      <Nav light />
      <main>
        <Editorial />
        <ClinicGlass />
        <EditorialFeatures />
        <Pricing />
        <div style={{ background: BONE }} className="px-5 sm:px-8 md:px-12">
          <ElasticDivider className="mx-auto max-w-[1240px]" />
        </div>
        <FounderCTA />
      </main>
      <Footer />
    </>
  );
}

/* ================================ HERO ================================ */

const HERO_SOURCES = ["Apple Health", "Apple Watch", "Garmin", "Oura", "WHOOP", "Blood tests"];

function Hero() {
  return (
    <section style={{ background: BONE }} className="px-6 pb-16 pt-10 text-black md:px-10 md:pb-24 md:pt-14">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">You · Daygo · Your clinic</p>
          <div className="mt-6 pl-4">
            <HeroHeadline />
          </div>

          <p className="mt-8 max-w-sm text-[16px] leading-relaxed text-black/60">
            Your watch, blood tests and how you feel in one app. With your consent, your clinic sees what changed
            between visits.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <a
              href={APP_STORE_URL}
              className="flex items-center gap-2.5 rounded-full bg-black px-7 py-3.5 text-[14px] font-semibold text-white transition hover:bg-black/85"
            >
              <AppleMark className="h-[18px] w-[18px]" />
              Download on the App Store
            </a>
            <a href="/clinics" className="text-[14px] font-semibold text-black/60 transition hover:text-black">
              For clinics →
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-black/45">
            {HERO_SOURCES.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>

        <Image
          src="/clinic/phone-hand.webp"
          alt="A hand holding a phone with the Daygo app, rain in the background"
          width={1672}
          height={941}
          priority
          sizes="(min-width: 768px) 45vw, 100vw"
          className="aspect-[4/5] w-full rounded-[2rem] object-cover object-[55%_50%]"
        />
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

/* ============================ CLINIC BRIDGE ============================ */

// Daygo as the connector between a patient and their clinic, in the same
// visual language as the clinic pitch deck: a dark photo cover, then the
// Invite -> Consent -> Follow -> Act line.
const BRIDGE = [
  { n: "1", title: "Invite", body: "Your clinic gives you a QR code at the visit." },
  { n: "2", title: "Consent", body: "You choose what to share, and can stop any time." },
  { n: "3", title: "Follow", body: "Your clinician sees trends against your own baseline." },
  { n: "4", title: "Act", body: "Retests, plans and reminders arrive in your app. No missed calls." },
];

function ClinicBridge() {
  return (
    <section id="clinics" style={{ background: BONE }} className="scroll-mt-6 px-6 py-16 text-black md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">For clinics and their patients</p>
            <h2 className="mt-5 text-[12vw] font-black uppercase leading-[0.86] tracking-tighter sm:text-[7vw] md:text-[3.6rem]">
              You and your clinic, between visits.
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-black/65">
              Most people see their clinic a few times a year. Daygo is the link in between: your app on one side, your
              clinician&apos;s view on the other, with your consent.
            </p>
          </div>
          <Image
            src="/clinic/dashboard.jpg"
            alt="The Daygo clinic dashboard: today's appointments and what changed for each patient"
            width={1680}
            height={900}
            className="w-full rounded-2xl shadow-[0_30px_80px_rgba(20,22,15,0.18)] ring-1 ring-black/10"
          />
        </div>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-4 sm:gap-6">
          <div className="absolute left-[12.5%] right-[12.5%] top-[22px] hidden h-px bg-black/15 sm:block" />
          {BRIDGE.map((b, i) => {
            const on = i === 2;
            return (
              <div key={b.n} className="relative flex flex-col items-start sm:items-center sm:text-center">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-black"
                  style={on ? { background: LIME, color: "#000" } : { background: BONE, border: "2px solid #000" }}
                >
                  {b.n}
                </span>
                <h3 className="mt-4 text-[18px] font-bold">{b.title}</h3>
                <p className="mt-2 max-w-[15rem] text-[13.5px] leading-relaxed text-black/60">{b.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-5 sm:justify-center">
          <a
            href="/clinics"
            className="rounded-full bg-black px-7 py-3.5 text-[14px] font-semibold text-white transition hover:bg-black/85"
          >
            Daygo for clinics →
          </a>
          <a href="/clinic" className="text-[13px] text-black/55 underline-offset-4 transition hover:text-black hover:underline">
            Clinic sign in
          </a>
        </div>
      </div>
    </section>
  );
}

/* =============================== PRICING =============================== */

// Prices mirror Daygo.storekit exactly: annual $99/yr with a 1-week free
// trial, weekly $2.99 with none. Both tiers unlock the same features, so
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
  { title: "7-day free trial", note: "No charge for 7 days", Icon: ClockIcon },
  { title: "Cancel anytime", note: "In your App Store settings", Icon: ShieldIcon },
  { title: "Never used to train AI", note: "Your data stays yours", Icon: LockIcon },
];

const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["500"], style: ["normal"] });
const PAPER_ACCENT = "#7A8F1F"; // darker lime, readable on bone

function PlanCheck({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[15px] leading-snug text-black/75">
      <svg viewBox="0 0 16 16" className="mt-[3px] h-4 w-4 shrink-0" aria-hidden>
        <path d="M3 8.4l3 3 7-7" fill="none" stroke={PAPER_ACCENT} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{children}</span>
    </li>
  );
}

/** A plan card: serif name with a small label, big serif price, the deal in one line,
 *  a short list and one clear button. */
function PlanCard({
  name,
  note,
  price,
  per,
  deal,
  items,
  href,
  cta,
  primary = false,
  footnote,
}: {
  name: string;
  note: string;
  price: React.ReactNode;
  per: string;
  deal: string;
  items: string[];
  href: string;
  cta: string;
  primary?: boolean;
  footnote: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-[40px] border p-8 md:p-10 ${primary ? "border-black/25 bg-white/70 shadow-[0_20px_50px_rgba(20,20,18,0.07)]" : "border-black/10 bg-white/35"}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className={`${bodoni.className} text-[32px] uppercase leading-none`}>{name}</h3>
        <span className="whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-[.2em]" style={{ color: PAPER_ACCENT }}>
          {note}
        </span>
      </div>

      <p className="mt-8 leading-none">
        {price}
        <span className="ml-2 text-[17px] text-black/55">{per}</span>
      </p>
      <p className="mt-3 text-[14.5px] text-black/60">{deal}</p>

      <ul className="mt-8 space-y-3.5 border-t border-black/10 pt-8">
        {items.map((x) => (
          <PlanCheck key={x}>{x}</PlanCheck>
        ))}
      </ul>

      <div className="mt-auto pt-10">
        <a
          href={href}
          className={`flex items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-semibold transition-colors duration-300 ${
            primary ? "bg-black text-white hover:bg-[#CDEE3C] hover:text-black" : "border border-black/25 hover:border-black hover:bg-black hover:text-white"
          }`}
        >
          {cta}
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
        <p className="mt-4 text-center text-[13px] text-black/50">{footnote}</p>
      </div>
    </div>
  );
}

function Pricing() {
  return (
    <section id="pricing" style={{ background: BONE }} className="px-5 py-24 text-black sm:px-8 md:px-10 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-[10.5px] font-semibold uppercase tracking-[.2em]" style={{ color: PAPER_ACCENT }}>
            Pricing
          </p>
          <h2 className={`${bodoni.className} mt-6 text-[11vw] uppercase leading-[.95] md:text-[clamp(40px,4.6vw,72px)]`}>
            Start free.
            <br />
            Decide in a week.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-black/60">
            Full access for 7 days. See what your data actually says, then decide.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <PlanCard
            primary
            name="Personal"
            note="For you"
            price={<span className={`${bodoni.className} text-[64px]`}>$2.99</span>}
            per="/ week"
            deal="or $99 a year, 7 days free (save 36%)"
            items={[
              "AI coach that remembers you",
              "Daily plan from sleep, training and labs",
              "Lab markers read from a photo",
              "Apple Health, Garmin, Oura and WHOOP",
              "Share with your clinic, only if you choose to",
            ]}
            href={APP_STORE_URL}
            cta="Start 7-day free trial"
            footnote="Billed through the App Store · Cancel anytime"
          />
          <PlanCard
            name="Clinic"
            note="For clinics"
            price={
              <>
                <span className="mr-2 text-[17px] text-black/55">from</span>
                <span className={`${bodoni.className} text-[64px]`}>€250</span>
              </>
            }
            per="/ month"
            deal="Start with a 60-day pilot."
            items={[
              "Clinician dashboard with trends against each patient's baseline",
              "A ready summary of what changed since the last visit",
              "Retests and plans sent straight to the patient's app",
              "GDPR-ready with a clinic DPA, audit log and two-factor sign-in",
            ]}
            href="/clinics"
            cta="See Daygo for clinics"
            footnote="Or book a 15-min call: hello@daygo.ai"
          />
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[12px] leading-relaxed text-black/45">
          Personal plans are billed through the App Store and can be cancelled any time in your iPhone&apos;s
          subscription settings. Your data is never used to train AI. Daygo is a wellbeing tool, not a medical device,
          and nothing in it is medical advice.
        </p>
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

        <a
          href="mailto:hello@daygo.ai?subject=Daygo%20for%20clinics"
          className="text-[14px] font-semibold text-white/75 transition hover:text-white"
        >
          Run a clinic? Book a demo →
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
