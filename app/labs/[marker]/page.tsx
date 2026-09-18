import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { markers, getMarker } from "@/lib/markers";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return markers.map((m) => ({ marker: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ marker: string }> }) {
  const { marker: slug } = await params;
  const marker = getMarker(slug);
  if (!marker) return {};
  return {
    title: `${marker.name}: what's normal, and what to do about it — Daygo`,
    description: marker.summary,
  };
}

export default async function MarkerPage({ params }: { params: Promise<{ marker: string }> }) {
  const { marker: slug } = await params;
  const marker = getMarker(slug);
  if (!marker) notFound();

  // MedicalWebPage schema — the structured, sourced shape both classic
  // search snippets and AI answer engines (GEO) tend to favor extracting
  // from, rather than free-text prose alone.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: marker.name,
    about: { "@type": "MedicalTest", name: marker.name },
    citation: marker.source.url,
    lastReviewed: new Date().toISOString().slice(0, 10),
  };

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <p className="text-sm mb-2" style={{ color: "var(--color-accent)" }}>
          {marker.category}
        </p>
        <h1 className="text-4xl font-medium tracking-tight mb-4" style={{ color: "var(--color-text)" }}>
          {marker.name}
        </h1>
        <p className="text-lg mb-8" style={{ color: "var(--color-text-soft)" }}>
          {marker.summary}
        </p>

        <div
          className="rounded-xl p-5 mb-8 flex flex-wrap gap-6"
          style={{ background: "var(--color-surface, rgba(255,255,255,0.04))", border: "1px solid var(--color-border, rgba(255,255,255,0.08))" }}
        >
          <div>
            <div className="text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
              Reference range
            </div>
            <div className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
              {marker.range}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
              Direction
            </div>
            <div className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
              {marker.interpretation}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-10 mb-3" style={{ color: "var(--color-text)" }}>
          Your reading
        </h2>
        <p style={{ color: "var(--color-text-soft)", lineHeight: 1.65 }}>{marker.reading}</p>

        <h2 className="text-2xl font-semibold mt-10 mb-3" style={{ color: "var(--color-text)" }}>
          What may help
        </h2>
        <ul className="list-disc pl-5 space-y-2" style={{ color: "var(--color-text-soft)" }}>
          {marker.mayHelp.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-3" style={{ color: "var(--color-text)" }}>
          When to talk to a doctor
        </h2>
        <p style={{ color: "var(--color-text-soft)", lineHeight: 1.65 }}>{marker.whenToTalkToDoctor}</p>

        <p className="text-sm mt-10" style={{ color: "var(--color-text-muted)" }}>
          Source:{" "}
          <a href={marker.source.url} style={{ color: "var(--color-accent)" }}>
            {marker.source.org}
          </a>
          . Reference ranges are standard adult intervals — your own lab may report a different range for your
          age, sex, or method. This isn't medical advice; always go by the range on your actual results and talk to
          a clinician about anything that concerns you.
        </p>

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--color-border, rgba(255,255,255,0.08))" }}>
          <p className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
            Other markers
          </p>
          <div className="flex flex-wrap gap-3">
            {markers
              .filter((m) => m.slug !== marker.slug)
              .map((m) => (
                <Link key={m.slug} href={`/labs/${m.slug}`} className="text-sm underline" style={{ color: "var(--color-accent)" }}>
                  {m.name}
                </Link>
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
