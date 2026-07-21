import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Support — Daygo",
  description: "Get help, report a bug, or ask a question.",
};

export default function SupportPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/65">
          <span className="block h-1 w-1 rounded-full bg-[var(--color-accent)]" />
          Support
        </div>
        <h1 className="tracking-display mt-6 text-5xl font-medium leading-tight md:text-6xl">
          Need help?
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
          We answer email like real humans. Within a day usually,
          sometimes faster.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <ContactCard
            title="General questions"
            email="hello@daygo.ai"
            body="Account stuff, feature requests, anything else."
          />
          <ContactCard
            title="Bug reports"
            email="support@daygo.ai"
            body="Tell us what happened, what you expected, and your iOS version."
          />
          <ContactCard
            title="Privacy"
            email="privacy@daygo.ai"
            body="Data export, deletion, GDPR / CCPA requests."
          />
          <ContactCard
            title="Press / partnerships"
            email="hello@daygo.ai"
            body="Reach out — happy to talk."
          />
        </div>

        <div className="mt-16">
          <h2 className="text-xl font-semibold">Common questions</h2>
          <dl className="mt-6 space-y-6 text-sm leading-relaxed">
            <Faq
              q="Does Daygo work without a Garmin?"
              a="Yes. The verdict, plan, chat, logs, lab tracking, and accountability loop all work without a wearable. Garmin sharpens the sleep / strain signals if you have one."
            />
            <Faq
              q="Is my data used to train AI?"
              a="No. We send the relevant slice of your data to Anthropic for the chat to work. They process it under their commercial terms and don't train on it. We never use it to train any model either."
            />
            <Faq
              q="Can I export my data?"
              a="Yes. Settings → Export PDF for a full health report. Email privacy@daygo.ai for a raw data export."
            />
            <Faq
              q="What if I have a medical question?"
              a="Daygo is a wellbeing tool, not a medical device. For anything urgent, contact a clinician or your local emergency number."
            />
          </dl>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ContactCard({
  title,
  email,
  body,
}: {
  title: string;
  email: string;
  body: string;
}) {
  return (
    <a
      href={`mailto:${email}`}
      className="rounded-2xl border border-white/[0.06] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-hi)]"
    >
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-1 text-sm text-[var(--color-accent)]">{email}</div>
      <div className="mt-2 text-sm text-white/65">{body}</div>
    </a>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <dt className="font-semibold text-white">{q}</dt>
      <dd className="mt-1 text-white/70">{a}</dd>
    </div>
  );
}
