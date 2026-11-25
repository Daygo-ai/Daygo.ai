import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BONE } from "@/lib/brand";
import { Accordion } from "@/components/Motion";

export const metadata = {
  title: "FAQ — Daygo",
  description: "Straight answers about Daygo: wearables, bloodwork, pricing, privacy and cancelling.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    q: "What is Daygo?",
    a: "Daygo is an AI health coach for iPhone. It reads your sleep, heart-rate variability, resting heart rate, workouts, food logs and blood test results, remembers what you tell it, and turns all of that into a plain-English read on what today needs.",
  },
  {
    q: "Does Daygo work with Apple Watch and Garmin?",
    a: "Yes. Daygo reads whatever your Apple Watch, Garmin or other wearable writes to Apple Health: sleep stages, heart-rate variability, resting heart rate and workouts.",
  },
  {
    q: "How is Daygo different from Whoop or Bevel?",
    a: "Daygo needs no extra hardware or band subscription: it works with the watch you already have. Instead of only showing scores, it's a coach you can talk to that remembers your goals and past conversations, and it reads your blood test results alongside your sleep and training.",
  },
  {
    q: "What do I need to start?",
    a: "An iPhone. Connecting Apple Health makes Daygo far more useful, but you don't need a wearable: the plan, chat, logs and lab tracking all work without one, and you can type things in by hand.",
  },
  {
    q: "Can I try it before paying?",
    a: "Yes. The annual plan starts with a 7-day free trial, and you can send a few chat messages before subscribing at all.",
  },
  {
    q: "What happens to my bloodwork?",
    a: "You photograph a results page and Daygo reads the markers from it, so you get plain-English context instead of a number with no meaning attached.",
  },
  {
    q: "Is this medical advice?",
    a: "No. Daygo is a wellbeing tool, not a medical device. It can help you spot patterns and ask better questions, but it does not diagnose anything — talk to a clinician about anything that concerns you, and for anything urgent contact your local emergency number.",
  },
  {
    q: "Is my data used to train AI?",
    a: "No. We send the relevant slice of your data to Anthropic for the chat to work. They process it under their commercial terms and don't train on it. We never use it to train any model either.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. Settings → Export PDF gives you a full health report. Email privacy@daygo.ai for a raw data export.",
  },
  {
    q: "How do I cancel?",
    a: "In your iPhone's subscription settings, the same place as every other App Store subscription. Cancelling there stops the renewal immediately.",
  },
];

/** The FAQ as FAQPage schema, which search and AI answers quote directly. */
function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <Nav light />
      <main>
    <section style={{ background: BONE }} className="px-6 py-20 text-black md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-black/45">
          <span>FAQ</span>
          <span>01 — {String(FAQS.length).padStart(2, "0")}</span>
        </div>

        <h1 className="mt-8 text-[12vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[7vw] md:text-[3.7rem]">
          Questions,
          <br />
          answered straight.
        </h1>

        <div className="mt-14">
          <Accordion items={FAQS} />
        </div>
      </div>
    </section>
  </main>
      <Footer />
    </>
  );
}
