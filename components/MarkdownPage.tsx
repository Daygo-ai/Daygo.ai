import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

/**
 * Renders one of the legal markdown files inside the standard nav +
 * footer chrome. The styles map markdown elements to the same dark
 * design language as the rest of the site so there's no jarring
 * transition between the landing page and the legal docs.
 */
export function MarkdownPage({ markdown }: { markdown: string }) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
        <article className="prose-daygo">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </article>
      </main>
      <style>{`
        .prose-daygo h1 { font-size: 2.5rem; font-weight: 500; letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 0.5rem; color: var(--color-text); }
        .prose-daygo h2 { font-size: 1.5rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 0.75rem; color: var(--color-text); }
        .prose-daygo h3 { font-size: 1.125rem; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.5rem; color: var(--color-text); }
        .prose-daygo p { margin: 0.75rem 0; line-height: 1.65; color: var(--color-text-soft); }
        .prose-daygo ul { margin: 0.75rem 0; padding-left: 1.25rem; list-style: disc; color: var(--color-text-soft); }
        .prose-daygo li { margin: 0.35rem 0; line-height: 1.55; }
        .prose-daygo a { color: var(--color-accent); text-decoration: underline; text-underline-offset: 3px; }
        .prose-daygo a:hover { color: var(--color-accent); }
        .prose-daygo em { color: var(--color-text-muted); font-style: italic; }
        .prose-daygo strong { color: var(--color-text); }
        .prose-daygo hr { border-color: rgba(255,255,255,0.08); margin: 2rem 0; }
        .prose-daygo code { background: rgba(255,255,255,0.06); padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.9em; }
      `}</style>
      <Footer />
    </>
  );
}
