import { MarkdownPage } from "@/components/MarkdownPage";
import { readLegalMarkdown } from "@/lib/markdown";

export const metadata = {
  title: "Terms — Daygo",
  description: "Daygo terms of service.",
};

export default async function TermsPage() {
  const markdown = await readLegalMarkdown("terms");
  return <MarkdownPage markdown={markdown} />;
}
