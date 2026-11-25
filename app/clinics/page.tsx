import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import { Bodoni_Moda } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ClinicMotion } from "@/components/ClinicMotion";
import { SceneMotion } from "@/components/SceneMotion";
import { BONE, LIME } from "@/lib/brand";

// Daygo for clinics. Same editorial language as the home page: serif
// headlines, small olive labels, hairlines and bone. Everything here should
// match what the product does today.

const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["500"], style: ["normal"] });
const ACCENT = "#7A8F1F"; // darker lime, readable on bone
const INK = "#141412";

export const metadata: Metadata = {
  title: "Daygo for clinics — Your patients, between visits",
  description:
    "Daygo connects private clinics with their patients between visits: wearable and lab data in one clinician view, retests and plans sent straight to the patient's app.",
  alternates: { canonical: "https://daygo.ai/clinics" },
};

const DEMO = "mailto:hello@daygo.ai?subject=Daygo%20for%20clinics%20demo";

const PROBLEMS = [
  ["Follow-ups run on phone calls", "Patients stop picking up. Retests slip, and the next visit starts from zero."],
  ["Prevention needs continuity", "Catching problems early depends on seeing what happens between visits."],
  ["The data exists, but not for you", "Patients track sleep, heart rate and more on their watch. None of it reaches the clinician."],
];

const STEPS = [
  ["Invite", "The patient scans a QR code at the visit."],
  ["Consent", "They choose what to share, and can stop any time."],
  ["Follow", "You see trends against the patient's own baseline."],
  ["Act", "Plans, retests and reminders go to their phone."],
];

const BENEFITS = [
  ["No more chasing calls", "You set the retest. Daygo reminds the patient in the app they open every day, until it's booked."],
  ["Visit prep in a minute", "A ready summary of what changed since the last visit: sleep, HRV, resting heart rate, labs and symptoms."],
  ["Patients who come back", "Prevention only works if people return. Daygo keeps them engaged between visits."],
];

const TRUST = [
  ["Consent per data type", "Patients can stop sharing any time"],
  ["Hosted in the EU", "GDPR-ready, with a clinic DPA"],
  ["Every view logged", "Audit log for clinic admins"],
  ["Access control", "Roles, two-factor sign-in, auto sign-out"],
  ["Never diagnoses", "The clinician decides"],
  ["No data selling", "Not used to train AI"],
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="rv text-[10.5px] font-semibold uppercase tracking-[.2em]" style={{ color: ACCENT }}>
      {children}
    </p>
  );
}

function Heading({ children, as: Tag = "h2", className = "" }: { children: React.ReactNode; as?: "h1" | "h2"; className?: string }) {
  return (
    <Tag className={`${bodoni.className} mt-6 uppercase leading-[.95] text-[11vw] md:text-[clamp(40px,4.8vw,72px)] ${className}`}>
      {children}
    </Tag>
  );
}

/** Splits text into letter spans for the rise-in animation; words never break. */
function L({ t, s = 0 }: { t: string; s?: number }) {
  let i = s;
  return (
    <>
      {t.split(" ").map((w, k, arr) => (
        <Fragment key={k}>
          <span className="inline-block whitespace-nowrap">
            {w.split("").map((ch, c) => (
              <span key={c} className="ltr" style={{ ["--i" as string]: i++ }}>
                {ch}
              </span>
            ))}
          </span>
          {k < arr.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** Holds its content in the middle of the screen for a moment on desktop. */
function Pin({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative md:h-[165svh]">
      <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:items-center">
        <div data-scene className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[3px] h-4 w-4 shrink-0" aria-hidden>
      <path d="M3 8.4l3 3 7-7" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ClinicsPage() {
  return (
    <>
      <ClinicMotion />
      <SceneMotion />
      <Nav light />
      <main style={{ background: BONE, color: INK }}>
        {/* ── HERO ── */}
        <section data-reveal className="px-6 pb-24 pt-14 md:px-10 md:pb-36 md:pt-20">
          <div className="mx-auto grid max-w-[1180px] items-center gap-14 md:grid-cols-[1fr_1fr]">
            <div>
              <Label>Daygo for clinics</Label>
              <Heading as="h1" className="md:text-[clamp(48px,5.6vw,88px)]">
                <L t="Your patients," />
                <br />
                <L t="between visits." s={14} />
              </Heading>
              <p className="rv mt-8 max-w-md text-[16px] leading-relaxed text-black/65">
                Wearable and lab data in one clinician view. Retests and plans go straight to the patient&apos;s phone,
                not to a missed call.
              </p>
              <div className="rv mt-10 flex flex-wrap items-center gap-6">
                <a href={DEMO} className="rounded-full bg-black px-7 py-3.5 text-[14px] font-semibold text-white transition hover:opacity-85">
                  Book a demo
                </a>
                <a href="/clinic" className="text-[13px] font-medium uppercase tracking-[.16em] text-black/60 transition hover:text-black">
                  Clinic sign in →
                </a>
              </div>
            </div>
            <div className="rv relative aspect-[4/5] overflow-hidden rounded-[28px] md:aspect-[5/6]">
              <Image
                src="/clinic/doctor.jpg"
                alt="A doctor in a white coat with a stethoscope, holding patient notes"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-[64%_25%]"
              />
            </div>
          </div>
        </section>

        {/* ── PROBLEM ── */}
        <section data-reveal className="px-6 py-24 md:px-10 md:py-0">
          <Pin>
          <div className="mx-auto max-w-[1180px]">
            <Label>The problem</Label>
            <Heading className="max-w-4xl">
              <L t="“See you in three months.”" />
              <br />
              <span className="text-black/35">
                <L t="Then silence." s={27} />
              </span>
            </Heading>
            <div className="rv mt-16 grid border-t border-black/15 md:grid-cols-3">
              {PROBLEMS.map(([t, b], i) => (
                <div key={t} className={`py-8 md:pr-10 ${i > 0 ? "border-t border-black/15 md:border-l md:border-t-0 md:pl-10" : ""}`}>
                  <h3 className="text-[17px] font-semibold">{t}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-black/60">{b}</p>
                </div>
              ))}
            </div>
          </div>
          </Pin>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section data-reveal id="how" className="px-6 py-24 md:px-10 md:py-0">
          <Pin>
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Label>How it works</Label>
                <Heading>
                  <L t="Set up in the room." />
                  <br />
                  <L t="Runs on its own." s={19} />
                </Heading>
              </div>
              <p className="rv max-w-xs text-[15px] leading-relaxed text-black/60 md:pb-3 md:text-right">
                One visit to start. After that, Daygo keeps the patient engaged until the next one.
              </p>
            </div>

            <ol className="rv relative mt-16 grid gap-12 md:mt-20 md:grid-cols-4 md:gap-0">
              <span aria-hidden className="absolute left-0 right-0 top-[5px] hidden h-px bg-black/15 md:block" />
              {STEPS.map(([t, b], n) => (
                <li key={t} className="relative md:pr-8">
                  <span aria-hidden className="relative block h-[11px] w-[11px] rounded-full" style={{ background: LIME, boxShadow: `0 0 0 4px ${BONE}` }} />
                  <span className={`${bodoni.className} mt-8 block text-[64px] leading-none text-black/15`}>0{n + 1}</span>
                  <span className={`${bodoni.className} mt-4 block text-[30px] uppercase leading-none`}>{t}</span>
                  <span className="mt-4 block max-w-[16rem] text-[15px] leading-relaxed text-black/60">{b}</span>
                </li>
              ))}
            </ol>
          </div>
          </Pin>
        </section>

        {/* ── PRODUCT ── */}
        <section data-reveal className="px-6 py-24 md:px-10 md:py-0">
          <Pin>
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Label>The clinic dashboard</Label>
                <Heading>
                  <L t="Who needs you today," />
                  <br />
                  <L t="and what changed." s={20} />
                </Heading>
              </div>
              <p className="rv max-w-xs text-[15px] leading-relaxed text-black/60 md:pb-3 md:text-right">
                A real screen with example patients. Live today, not a mock-up.
              </p>
            </div>
            {/* screen only: cropped just below the display, with the last strip fading into the page */}
            <div className="rv relative mx-auto mt-10 aspect-[1920/985] max-w-[1000px] overflow-hidden">
              <Image
                src="/clinic/dashboard-macbook.jpg"
                alt="The Daygo clinic dashboard on a MacBook: today's appointments and what changed for each patient"
                width={1920}
                height={1080}
                className="absolute inset-x-0 top-0 w-full"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[9%]"
                style={{ background: `linear-gradient(to bottom, ${BONE}00, ${BONE})` }}
              />
            </div>

          </div>
          </Pin>
        </section>

        {/* ── BENEFITS ── */}
        <section data-reveal className="px-6 pb-24 md:px-10 md:pb-36">
          <div data-scene className="mx-auto max-w-[1180px]">
            <div className="rv grid border-t border-black/15 md:grid-cols-3">
              {BENEFITS.map(([t, b], i) => (
                <div key={t} className={`py-8 md:pr-10 ${i > 0 ? "border-t border-black/15 md:border-l md:border-t-0 md:pl-10" : ""}`}>
                  <h3 className="text-[17px] font-semibold">{t}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-black/60">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING + TRUST ── */}
        <section data-reveal id="privacy" className="px-6 py-24 md:px-10 md:py-0">
          <Pin>
          <div className="mx-auto grid max-w-[1180px] gap-14 md:grid-cols-[1fr_1fr] md:gap-20">
            <div>
              <Label>Privacy and safety</Label>
              <Heading>
                <L t="Their data." />
                <br />
                <L t="Their choice." s={11} />
              </Heading>
              <p className="rv mt-6 max-w-sm text-[15px] leading-relaxed text-black/60">Built for health data from day one, not added later.</p>
              <ul className="rv mt-10 grid gap-x-8 gap-y-6 border-t border-black/15 pt-8 sm:grid-cols-2">
                {TRUST.map(([t, b]) => (
                  <li key={t} className="flex gap-3">
                    <Check />
                    <div>
                      <p className="text-[15px] font-semibold">{t}</p>
                      <p className="mt-1 text-[14px] text-black/55">{b}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rv flex flex-col border-t border-black/15 pt-10 md:mt-[4.5rem]">
              <div className="flex items-baseline gap-4">
                <h3 className={`${bodoni.className} text-[40px] uppercase leading-none`}>Clinic</h3>
                <span className="text-[10.5px] font-semibold uppercase tracking-[.2em]" style={{ color: ACCENT }}>
                  Start with a pilot
                </span>
              </div>
              <div className="mt-8 leading-none">
                <span className="mr-2 text-[17px] text-black/55">from</span>
                <span className={`${bodoni.className} text-[76px]`}>€250</span>
                <span className="ml-2 text-[17px] text-black/55">/ month per clinic</span>
              </div>
              <p className="mt-3 text-[14.5px] text-black/60">For up to 40 patients; larger clinics are priced to size. Start with a 60-day pilot.</p>
              <div className="mt-8 border-t border-black/10 pt-8">
                <ul className="space-y-4 text-[15px] text-black/75">
                  {["Clinician dashboard with trends and visit prep", "Retests and plans sent to the patient's app", "GDPR-ready, with a clinic DPA"].map((x) => (
                    <li key={x} className="flex gap-3">
                      <Check />
                      {x}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[14px] leading-relaxed text-black/55">
                  Patients can add the AI coach for €3 a week, paid by them.
                </p>
              </div>
              <div className="mt-auto pt-10">
                <a href={DEMO} className="group inline-flex items-center gap-4 text-[15px] font-semibold">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white transition-colors duration-300 group-hover:bg-[#CDEE3C] group-hover:text-black">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                  Start a pilot
                </a>
              </div>
            </div>
          </div>
          </Pin>
        </section>

        {/* ── FOUNDER ── */}
        <section data-reveal className="px-6 pb-28 pt-8 md:px-10 md:pb-36">
          <div className="rv mx-auto flex max-w-[1180px] flex-col gap-8 rounded-[28px] border border-black/10 bg-white/60 p-6 shadow-[0_12px_40px_rgba(20,20,18,0.05)] md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-center gap-6">
              <Image src="/clinic/founder.jpg" alt="Marijus Dovydaitis, founder of Daygo" width={400} height={400} className="h-20 w-20 rounded-2xl object-cover" />
              <div>
                <p className="text-[17px] font-semibold">Built in Vilnius by Marijus Dovydaitis</p>
                <p className="mt-1 max-w-md text-[14.5px] leading-relaxed text-black/60">
                  Founder. 4 years in B2B sales. I&apos;d love to show you Daygo and hear how follow-ups work in your clinic.
                </p>
              </div>
            </div>
            <a href={DEMO} className="shrink-0 self-start rounded-full bg-black px-7 py-3.5 text-[14px] font-semibold text-white transition hover:opacity-85 md:self-auto">
              Book a 15-min call
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
