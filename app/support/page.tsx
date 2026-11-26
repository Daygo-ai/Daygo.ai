import { SupportPage } from "@/components/pages/SupportPage";

export const metadata = {
  title: "Support — Daygo",
  description: "Get help, report a bug, or ask a question.",
  alternates: { languages: { en: "/support", lt: "/lt/support" } },
};

export default function Page() {
  return <SupportPage lang="en" />;
}
