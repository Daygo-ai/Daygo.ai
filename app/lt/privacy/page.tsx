import { MarkdownPage } from "@/components/MarkdownPage";
import { readLegalMarkdown } from "@/lib/markdown";

export const metadata = {
  title: "Privatumas — Daygo",
  description: "Kaip Daygo tvarko jūsų duomenis. Paprasta kalba.",
  alternates: { languages: { en: "/privacy", lt: "/lt/privacy" } },
};

export default async function Page() {
  const markdown = await readLegalMarkdown("privacy-policy", "lt");
  return <MarkdownPage markdown={markdown} lang="lt" />;
}
