import Link from "next/link";
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

          <div className="mt-16 border-t border-black/10 pt-8 text-[14px] text-black/65">
            Looking for quick answers?{" "}
            <Link href="/faq" className="font-semibold text-black" style={{ boxShadow: `inset 0 -0.5em 0 ${LIME}` }}>
              Read the FAQ →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
