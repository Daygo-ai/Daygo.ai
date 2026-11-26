import type { Metadata } from "next";
import { HtmlLang } from "@/components/LangToggle";

export const metadata: Metadata = {
  title: "Daygo — Jūsų sveikata tarp vizitų",
  description:
    "Daygo sujungia pacientus ir jų kliniką: jūsų laikrodis, kraujo tyrimai ir savijauta vienoje programėlėje, o gavus jūsų sutikimą, gydytojas aiškiai mato pokyčius tarp vizitų.",
  openGraph: {
    title: "Daygo — Jūsų sveikata tarp vizitų",
    description: "DI treneris, kuris jus prisimena, padeda laikytis plano ir pasako, ko iš tikrųjų reikia šiandien.",
    url: "https://daygo.ai/lt",
    siteName: "Daygo",
    type: "website",
    locale: "lt_LT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daygo — Jūsų sveikata tarp vizitų",
    description: "DI treneris, kuris jus prisimena, padeda laikytis plano ir pasako, ko iš tikrųjų reikia šiandien.",
  },
};

export default function LtLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HtmlLang lang="lt" />
      {children}
    </>
  );
}
