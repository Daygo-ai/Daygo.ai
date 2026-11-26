import { Bodoni_Moda } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { APP_STORE_URL, BONE, BOOK_CALL_URL } from "@/lib/brand";
import { Editorial, EditorialFeatures } from "@/components/Editorial";
import { ClinicGlass, FounderCTA } from "@/components/GlassSections";
import { IntroLoader } from "@/components/IntroLoader";
import { SceneMotion } from "@/components/SceneMotion";
import { ElasticDivider } from "@/components/Motion";
import { localePath, type Lang } from "@/lib/i18n";

// The marketing home page, in English (/) and Lithuanian (/lt). Chrome
// (nav/footer) and brand tokens are shared with the other pages.

/** Tells search and AI answer engines what Daygo is. */
function appJsonLd(lang: Lang) {
  const lt = lang === "lt";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MobileApplication",
        name: "Daygo",
        operatingSystem: "iOS",
        applicationCategory: "HealthApplication",
        inLanguage: lang,
        description: lt
          ? "DI sveikatos treneris, kuris jus prisimena: jūsų miegas, treniruotės, mityba ir laboratoriniai tyrimai."
          : "An AI health coach that remembers you, built on your sleep, training, food and lab work.",
        url: lt ? "https://daygo.ai/lt" : "https://daygo.ai",
        downloadUrl: APP_STORE_URL,
        installUrl: APP_STORE_URL,
        sameAs: [APP_STORE_URL],
        featureList: lt
          ? [
              "DI sveikatos trenerio pokalbis, kuris prisimena jūsų tikslus ir istoriją",
              "Miegas, HRV ir ramybės pulsas iš Apple Health",
              "Kraujo tyrimų skaitymas: nufotografuokite rezultatus ir gaukite paaiškinimą",
              "Bėgimo planai ir kasdienės rekomendacijos",
            ]
          : [
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
}

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd(lang)) }} />
      <IntroLoader />
      <SceneMotion />
      <Nav light lang={lang} />
      <main>
        <Editorial />
        <ClinicGlass />
        <EditorialFeatures />
        <Pricing lang={lang} />
        <div style={{ background: BONE }} className="px-5 sm:px-8 md:px-12">
          <ElasticDivider className="mx-auto max-w-[1240px]" />
        </div>
        <FounderCTA />
      </main>
      <Footer lang={lang} />
    </>
  );
}

/* =============================== PRICING =============================== */

// Prices mirror Daygo.storekit exactly: annual $99/yr with a 1-week free
// trial, weekly $2.99 with none. Both tiers unlock the same features.

const bodoni = Bodoni_Moda({ subsets: ["latin", "latin-ext"], weight: ["500"], style: ["normal"] });
const PAPER_ACCENT = "#7A8F1F"; // darker lime, readable on bone

const PRICING = {
  en: {
    label: "Pricing",
    title: ["Start free.", "Decide in a week."],
    intro: "Full access for 7 days. See what your data actually says, then decide.",
    personal: {
      name: "Personal",
      note: "For you",
      per: "/ week",
      deal: "or $99 a year, 7 days free (save 36%)",
      items: [
        "AI coach that remembers you",
        "Daily plan from sleep, training and labs",
        "Lab markers read from a photo",
        "Apple Health, Garmin, Oura and WHOOP",
        "Share with your clinic, only if you choose to",
      ],
      cta: "Start 7-day free trial",
      footnote: "Billed through the App Store · Cancel anytime",
    },
    clinic: {
      name: "Clinic",
      note: "For clinics",
      from: "from",
      per: "/ month",
      deal: "Start with a 60-day pilot.",
      items: [
        "Clinician dashboard with trends against each patient's baseline",
        "A ready summary of what changed since the last visit",
        "Retests and plans sent straight to the patient's app",
        "GDPR-ready with a clinic DPA, audit log and two-factor sign-in",
      ],
      cta: "See Daygo for clinics",
      or: "Or",
      call: "book a 30-min call",
      withFounder: "with the founder",
    },
    fine:
      "Personal plans are billed through the App Store and can be cancelled any time in your iPhone's subscription settings. Your data is never used to train AI. Daygo is a wellbeing tool, not a medical device, and nothing in it is medical advice.",
  },
  lt: {
    label: "Kainos",
    title: ["Pradėkite nemokamai.", "Apsispręskite per savaitę."],
    intro: "Pilna prieiga 7 dienoms. Pažiūrėkite, ką iš tikrųjų rodo jūsų duomenys, ir tada nuspręskite.",
    personal: {
      name: "Asmeninis",
      note: "Jums",
      per: "/ sav.",
      deal: "arba $99 per metus, 7 dienos nemokamai (sutaupote 36 %)",
      items: [
        "DI treneris, kuris jus prisimena",
        "Dienos planas pagal miegą, treniruotes ir tyrimus",
        "Tyrimų rodikliai nuskaitomi iš nuotraukos",
        "Apple Health, Garmin, Oura ir WHOOP",
        "Dalinkitės su savo klinika, tik jei patys to norite",
      ],
      cta: "Pradėti 7 dienų nemokamą laikotarpį",
      footnote: "Apmokama per App Store · Atšaukite bet kada",
    },
    clinic: {
      name: "Klinika",
      note: "Klinikoms",
      from: "nuo",
      per: "/ mėn.",
      deal: "Pradėkite nuo 60 dienų bandomojo laikotarpio.",
      items: [
        "Gydytojo skydelis su kiekvieno paciento pokyčiais, palyginti su jo paties norma",
        "Paruošta santrauka, kas pasikeitė nuo paskutinio vizito",
        "Pakartotiniai tyrimai ir planai siunčiami tiesiai į paciento programėlę",
        "Atitinka BDAR: klinikos duomenų tvarkymo sutartis, veiksmų žurnalas ir dviejų veiksnių prisijungimas",
      ],
      cta: "Daygo klinikoms",
      or: "Arba",
      call: "užsisakykite 30 min. pokalbį",
      withFounder: "su įkūrėju",
    },
    fine:
      "Asmeniniai planai apmokami per App Store ir gali būti atšaukti bet kada jūsų iPhone prenumeratų nustatymuose. Jūsų duomenys niekada nenaudojami DI mokymui. Daygo yra savijautos įrankis, o ne medicinos priemonė, ir niekas joje nėra medicininis patarimas.",
  },
};

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
  footnote: React.ReactNode;
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

function Pricing({ lang }: { lang: Lang }) {
  const c = PRICING[lang];
  return (
    <section id="pricing" style={{ background: BONE }} className="px-5 py-24 text-black sm:px-8 md:px-10 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-[10.5px] font-semibold uppercase tracking-[.2em]" style={{ color: PAPER_ACCENT }}>
            {c.label}
          </p>
          <h2 className={`${bodoni.className} mt-6 text-[11vw] uppercase leading-[.95] md:text-[clamp(40px,4.6vw,72px)]`}>
            {c.title[0]}
            <br />
            {c.title[1]}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-black/60">{c.intro}</p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <PlanCard
            primary
            name={c.personal.name}
            note={c.personal.note}
            price={<span className={`${bodoni.className} text-[64px]`}>$2.99</span>}
            per={c.personal.per}
            deal={c.personal.deal}
            items={c.personal.items}
            href={APP_STORE_URL}
            cta={c.personal.cta}
            footnote={c.personal.footnote}
          />
          <PlanCard
            name={c.clinic.name}
            note={c.clinic.note}
            price={
              <>
                <span className="mr-2 text-[17px] text-black/55">{c.clinic.from}</span>
                <span className={`${bodoni.className} text-[64px]`}>€250</span>
              </>
            }
            per={c.clinic.per}
            deal={c.clinic.deal}
            items={c.clinic.items}
            href={localePath(lang, "/clinics")}
            cta={c.clinic.cta}
            footnote={
              <>
                {c.clinic.or}{" "}
                <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black">
                  {c.clinic.call}
                </a>{" "}
                {c.clinic.withFounder}
              </>
            }
          />
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[12px] leading-relaxed text-black/45">{c.fine}</p>
      </div>
    </section>
  );
}
