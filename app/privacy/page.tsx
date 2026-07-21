import { MarkdownPage } from "@/components/MarkdownPage";
import { readLegalMarkdown } from "@/lib/markdown";

export const metadata = {
  title: "Privacy — Daygo",
  description: "How Daygo handles your data. Plain English.",
};

export default async function PrivacyPage() {
  const markdown = await readLegalMarkdown("privacy-policy");
  return <MarkdownPage markdown={markdown} />;
}
