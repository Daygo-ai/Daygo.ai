import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BONE, LIME } from "@/lib/brand";

/**
 * Renders one of the legal markdown files inside the shared nav + footer
 * chrome, in the editorial light theme: bone page, black type, mono
 * headings that echo the section labels used across the marketing pages.
 */
export function MarkdownPage({ markdown }: { markdown: string }) {
  return (
    <>
      <Nav />
      <main style={{ background: BONE }} className="px-6 py-16 text-black md:px-10 md:py-24">
        <article className="prose-daygo mx-auto max-w-3xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </article>
      </main>
      <style>{`
        .prose-daygo h1 { font-size: clamp(2.5rem, 6vw, 3.5rem); font-weight: 900; text-transform: uppercase; letter-spacing: -0.04em; line-height: 0.9; margin-bottom: 1.5rem; color: #000; }
        .prose-daygo h2 { font-size: 1.375rem; font-weight: 700; margin-top: 2.75rem; margin-bottom: 0.75rem; color: #000; }
        .prose-daygo h3 { font-size: 1.0625rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.5rem; color: #000; }
        .prose-daygo p { margin: 0.85rem 0; line-height: 1.7; font-size: 0.9375rem; color: rgba(0,0,0,0.68); }
        .prose-daygo ul { margin: 0.85rem 0; padding-left: 1.25rem; list-style: disc; color: rgba(0,0,0,0.68); }
        .prose-daygo ol { margin: 0.85rem 0; padding-left: 1.25rem; list-style: decimal; color: rgba(0,0,0,0.68); }
        .prose-daygo li { margin: 0.35rem 0; line-height: 1.6; font-size: 0.9375rem; }
        .prose-daygo a { color: #000; text-decoration: underline; text-decoration-color: ${LIME}; text-decoration-thickness: 3px; text-underline-offset: 3px; }
        .prose-daygo a:hover { background: ${LIME}; }
        .prose-daygo em { color: rgba(0,0,0,0.5); font-style: italic; }
        .prose-daygo strong { color: #000; font-weight: 700; }
        .prose-daygo hr { border: 0; border-top: 1px solid rgba(0,0,0,0.12); margin: 2.5rem 0; }
        .prose-daygo code { background: rgba(0,0,0,0.06); padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.875em; }
        .prose-daygo table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: 0.875rem; }
        .prose-daygo th, .prose-daygo td { border: 1px solid rgba(0,0,0,0.12); padding: 0.5rem 0.75rem; text-align: left; }
        .prose-daygo th { font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.6875rem; }
      `}</style>
      <Footer />
    </>
  );
}
