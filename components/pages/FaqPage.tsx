import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BONE } from "@/lib/brand";
import { Accordion } from "@/components/Motion";
import type { Lang } from "@/lib/i18n";

export const FAQS = {
  en: [
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
  ],
  lt: [
    {
      q: "Kas yra Daygo?",
      a: "Daygo yra DI sveikatos treneris iPhone telefonui. Jis skaito jūsų miegą, širdies ritmo variabilumą (HRV), ramybės pulsą, treniruotes, mitybos įrašus ir kraujo tyrimų rezultatus, prisimena, ką jam pasakote, ir visa tai paverčia paprastu paaiškinimu, ko reikia šiandien.",
    },
    {
      q: "Ar Daygo veikia su Apple Watch ir Garmin?",
      a: "Taip. Daygo skaito viską, ką jūsų Apple Watch, Garmin ar kitas išmanusis įrenginys įrašo į Apple Health: miego fazes, širdies ritmo variabilumą, ramybės pulsą ir treniruotes.",
    },
    {
      q: "Kuo Daygo skiriasi nuo Whoop ar Bevel?",
      a: "Daygo nereikia jokios papildomos įrangos ar apyrankės prenumeratos: jis veikia su laikrodžiu, kurį jau turite. Užuot tik rodęs balus, tai treneris, su kuriuo galite kalbėtis, kuris prisimena jūsų tikslus bei ankstesnius pokalbius ir skaito jūsų kraujo tyrimus kartu su miegu ir treniruotėmis.",
    },
    {
      q: "Ko reikia norint pradėti?",
      a: "iPhone telefono. Prijungtas Apple Health Daygo padaro daug naudingesnį, tačiau išmaniojo laikrodžio nebūtina turėti: planas, pokalbis, įrašai ir tyrimų sekimas veikia ir be jo, o duomenis galite įvesti ranka.",
    },
    {
      q: "Ar galiu išbandyti prieš mokėdamas?",
      a: "Taip. Metinis planas prasideda 7 dienų nemokamu laikotarpiu, be to, keletą žinučių pokalbyje galite išsiųsti dar visai neprenumeravę.",
    },
    {
      q: "Kas nutinka su mano kraujo tyrimais?",
      a: "Nufotografuojate rezultatų lapą, o Daygo nuskaito iš jo rodiklius, todėl gaunate paprastą paaiškinimą, o ne skaičių be jokios prasmės.",
    },
    {
      q: "Ar tai medicininis patarimas?",
      a: "Ne. Daygo yra savijautos įrankis, o ne medicinos priemonė. Jis gali padėti pastebėti dėsningumus ir užduoti geresnius klausimus, bet nieko nediagnozuoja – dėl visko, kas jums kelia nerimą, pasitarkite su gydytoju, o skubiu atveju skambinkite bendruoju pagalbos numeriu 112.",
    },
    {
      q: "Ar mano duomenys naudojami DI mokymui?",
      a: "Ne. Kad pokalbis veiktų, aktualią jūsų duomenų dalį siunčiame Anthropic. Jie juos tvarko pagal savo komercines sąlygas ir nenaudoja mokymui. Mes taip pat niekada nenaudojame jų jokiam modeliui mokyti.",
    },
    {
      q: "Ar galiu eksportuoti savo duomenis?",
      a: "Taip. Nustatymai → Eksportuoti PDF suteikia pilną sveikatos ataskaitą. Neapdorotų duomenų eksportui rašykite privacy@daygo.ai.",
    },
    {
      q: "Kaip atšaukti prenumeratą?",
      a: "Savo iPhone prenumeratų nustatymuose, toje pačioje vietoje kaip ir visas kitas App Store prenumeratas. Atšaukus ten, atnaujinimas sustabdomas iškart.",
    },
  ],
};

/** The FAQ as FAQPage schema, which search and AI answers quote directly. */
function faqJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: FAQS[lang].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function FaqPage({ lang }: { lang: Lang }) {
  const faqs = FAQS[lang];
  const lt = lang === "lt";
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(lang)) }} />
      <Nav light lang={lang} />
      <main>
        <section style={{ background: BONE }} className="px-6 py-20 text-black md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-black/45">
              <span>{lt ? "DUK" : "FAQ"}</span>
              <span>01 — {String(faqs.length).padStart(2, "0")}</span>
            </div>

            <h1 className="mt-8 text-[12vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[7vw] md:text-[3.7rem]">
              {lt ? "Klausimai," : "Questions,"}
              <br />
              {lt ? "atsakymai be užuolankų." : "answered straight."}
            </h1>

            <div className="mt-14">
              <Accordion items={faqs} />
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
