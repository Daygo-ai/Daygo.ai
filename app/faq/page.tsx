import { FaqPage } from "@/components/pages/FaqPage";

export const metadata = {
  title: "FAQ — Daygo",
  description: "Straight answers about Daygo: wearables, bloodwork, pricing, privacy and cancelling.",
  alternates: { canonical: "/faq", languages: { en: "/faq", lt: "/lt/faq" } },
};

export default function Page() {
  return <FaqPage lang="en" />;
}
