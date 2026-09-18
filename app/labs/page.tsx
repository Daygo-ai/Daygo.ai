import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { markers } from "@/lib/markers";
import Link from "next/link";

export const metadata = {
  title: "Lab markers explained, in plain English — Daygo",
  description: "What your lab values actually mean, what's normal, and what may help — one page per marker.",
};

export default function LabsIndexPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
        <h1 className="text-4xl font-medium tracking-tight mb-4" style={{ color: "var(--color-text)" }}>
          Lab markers, in plain English
        </h1>
        <p className="text-lg mb-10" style={{ color: "var(--color-text-soft)" }}>
          What each marker actually measures, what's normal, and what may help — the same interpretation Daygo
          gives you in the app, written out here.
        </p>
        <div className="grid gap-3">
          {markers.map((m) => (
            <Link
              key={m.slug}
              href={`/labs/${m.slug}`}
              className="block rounded-xl p-5"
              style={{ background: "var(--color-surface, rgba(255,255,255,0.04))", border: "1px solid var(--color-border, rgba(255,255,255,0.08))" }}
            >
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--color-accent)" }}>
                {m.category}
              </div>
              <div className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
                {m.name}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                {m.range}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
