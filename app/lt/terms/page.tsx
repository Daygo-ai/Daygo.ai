import { MarkdownPage } from "@/components/MarkdownPage";
import { readLegalMarkdown } from "@/lib/markdown";

export const metadata = {
  title: "Naudojimosi sąlygos — Daygo",
  description: "Daygo naudojimosi sąlygos.",
  alternates: { languages: { en: "/terms", lt: "/lt/terms" } },
};

export default async function Page() {
  const markdown = await readLegalMarkdown("terms", "lt");
  return <MarkdownPage markdown={markdown} lang="lt" />;
}
