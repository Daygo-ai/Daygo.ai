import { FaqPage } from "@/components/pages/FaqPage";

export const metadata = {
  title: "DUK — Daygo",
  description: "Aiškūs atsakymai apie Daygo: išmanieji laikrodžiai, kraujo tyrimai, kainos, privatumas ir prenumeratos atšaukimas.",
  alternates: { canonical: "/lt/faq", languages: { en: "/faq", lt: "/lt/faq" } },
};

export default function Page() {
  return <FaqPage lang="lt" />;
}
