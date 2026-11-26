import { SupportPage } from "@/components/pages/SupportPage";

export const metadata = {
  title: "Pagalba — Daygo",
  description: "Gaukite pagalbą, praneškite apie klaidą arba užduokite klausimą.",
  alternates: { languages: { en: "/support", lt: "/lt/support" } },
};

export default function Page() {
  return <SupportPage lang="lt" />;
}
