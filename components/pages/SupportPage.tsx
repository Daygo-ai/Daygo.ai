import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BONE, LIME } from "@/lib/brand";
import { localePath, type Lang } from "@/lib/i18n";

const COPY = {
  en: {
    label: "Support",
    speed: "Usually within a day",
    title: "Need help?",
    intro: "We answer email like real humans. Within a day usually, sometimes faster.",
    contacts: [
      { title: "General questions", email: "hello@daygo.ai", body: "Account stuff, feature requests, anything else." },
      { title: "Bug reports", email: "support@daygo.ai", body: "Tell us what happened, what you expected, and your iOS version." },
      { title: "Privacy", email: "privacy@daygo.ai", body: "Data export, deletion, GDPR / CCPA requests." },
      { title: "Press / partnerships", email: "hello@daygo.ai", body: "Reach out — happy to talk." },
    ],
    faqLead: "Looking for quick answers?",
    faqLink: "Read the FAQ →",
  },
  lt: {
    label: "Pagalba",
    speed: "Paprastai per dieną",
    title: "Reikia pagalbos?",
    intro: "Į laiškus atsakome kaip tikri žmonės. Paprastai per dieną, kartais greičiau.",
    contacts: [
      { title: "Bendri klausimai", email: "hello@daygo.ai", body: "Paskyros reikalai, funkcijų pageidavimai ir visa kita." },
      { title: "Klaidų pranešimai", email: "support@daygo.ai", body: "Parašykite, kas nutiko, ko tikėjotės ir kokia jūsų iOS versija." },
      { title: "Privatumas", email: "privacy@daygo.ai", body: "Duomenų eksportas, ištrynimas, BDAR / CCPA prašymai." },
      { title: "Žiniasklaida / partnerystės", email: "hello@daygo.ai", body: "Parašykite – mielai pasikalbėsime." },
    ],
    faqLead: "Ieškote greitų atsakymų?",
    faqLink: "Skaityti DUK →",
  },
};

export function SupportPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <>
      <Nav lang={lang} />
      <main style={{ background: BONE }} className="px-6 py-16 text-black md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-black/45">
            <span>{c.label}</span>
            <span>{c.speed}</span>
          </div>

          <h1 className="mt-8 text-[13vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[7vw] md:text-[3.7rem]">
            {c.title}
          </h1>
          <p className="mt-5 max-w-md text-[14px] leading-relaxed text-black/65">{c.intro}</p>

          <div className="mt-12 grid border-t border-black/10 sm:grid-cols-2">
            {c.contacts.map((x, i) => (
              <a
                key={x.title + x.email}
                href={`mailto:${x.email}`}
                className={`group border-b border-black/10 p-7 transition hover:bg-black/[0.03] ${
                  i % 2 === 1 ? "sm:border-l sm:border-l-black/10" : ""
                }`}
              >
                <div className="text-[15px] font-bold">{x.title}</div>
                <div className="mt-1 inline-block text-[13px] font-medium" style={{ boxShadow: `inset 0 -0.5em 0 ${LIME}` }}>
                  {x.email}
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-black/60">{x.body}</p>
              </a>
            ))}
          </div>

          <div className="mt-16 border-t border-black/10 pt-8 text-[14px] text-black/65">
            {c.faqLead}{" "}
            <Link href={localePath(lang, "/faq")} className="font-semibold text-black" style={{ boxShadow: `inset 0 -0.5em 0 ${LIME}` }}>
              {c.faqLink}
            </Link>
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
