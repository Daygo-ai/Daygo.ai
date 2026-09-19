import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BONE, LIME } from "@/lib/brand";

export const metadata = {
  title: "Support — Daygo",
  description: "Get help, report a bug, or ask a question.",
};

const CONTACTS = [
  { title: "General questions", email: "hello@daygo.ai", body: "Account stuff, feature requests, anything else." },
  {
    title: "Bug reports",
    email: "support@daygo.ai",
    body: "Tell us what happened, what you expected, and your iOS version.",
  },
  { title: "Privacy", email: "privacy@daygo.ai", body: "Data export, deletion, GDPR / CCPA requests." },
  { title: "Press / partnerships", email: "hello@daygo.ai", body: "Reach out — happy to talk." },
];

const FAQS = [
  {
    q: "Does Daygo work without a Garmin?",
    a: "Yes. The verdict, plan, chat, logs, lab tracking, and accountability loop all work without a wearable. Garmin sharpens the sleep / strain signals if you have one.",
  },
  {
    q: "Is my data used to train AI?",
    a: "No. We send the relevant slice of your data to Anthropic for the chat to work. They process it under their commercial terms and don't train on it. We never use it to train any model either.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. Settings → Export PDF for a full health report. Email privacy@daygo.ai for a raw data export.",
  },
  {
    q: "What if I have a medical question?",
    a: "Daygo is a wellbeing tool, not a medical device. For anything urgent, contact a clinician or your local emergency number.",
  },
];

export default function SupportPage() {
  return (
    <>
      <Nav />
      <main style={{ background: BONE }} className="px-6 py-16 text-black md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-black/45">
            <span>Support</span>
            <span>Usually within a day</span>
          </div>

          <h1 className="mt-8 text-[13vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[7vw] md:text-[3.7rem]">
            Need help?
          </h1>
          <p className="mt-5 max-w-md text-[14px] leading-relaxed text-black/65">
            We answer email like real humans. Within a day usually, sometimes faster.
          </p>

          <div className="mt-12 grid border-t border-black/10 sm:grid-cols-2">
            {CONTACTS.map((c, i) => (
              <a
                key={c.title + c.email}
                href={`mailto:${c.email}`}
                className={`group border-b border-black/10 p-7 transition hover:bg-black/[0.03] ${
                  i % 2 === 1 ? "sm:border-l sm:border-l-black/10" : ""
                }`}
              >
                <div className="text-[15px] font-bold">{c.title}</div>
                <div
                  className="mt-1 inline-block text-[13px] font-medium"
                  style={{ boxShadow: `inset 0 -0.5em 0 ${LIME}` }}
                >
                  {c.email}
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-black/60">{c.body}</p>
              </a>
            ))}
          </div>

          <div className="mt-16">
            <div className="font-mono text-[10px] uppercase tracking-widest text-black/45">Common questions</div>
            <dl className="mt-8 border-t border-black/10">
              {FAQS.map((f, i) => (
                <div
                  key={f.q}
                  className="grid gap-3 border-b border-black/10 py-7 md:grid-cols-[3rem_1fr_1.1fr] md:gap-8"
                >
                  <div className="font-mono text-[10px] tracking-widest text-black/35">0{i + 1}</div>
                  <dt className="text-[17px] font-bold leading-snug">{f.q}</dt>
                  <dd className="text-[14px] leading-relaxed text-black/65">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
