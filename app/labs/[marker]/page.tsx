import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { markers, getMarker } from "@/lib/markers";
import { BONE, LIME } from "@/lib/brand";
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
      <main style={{ background: BONE }} className="px-6 py-16 text-black md:px-10 md:py-24">
        <div className="mx-auto max-w-4xl">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-black/45">
            <span>{marker.category}</span>
            <Link href="/labs" className="transition hover:text-black">
              All markers →
            </Link>
          </div>

          <h1 className="mt-8 text-[12vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[7vw] md:text-[3.7rem]">
            {marker.name}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-black/70">{marker.summary}</p>

          <div className="mt-12 grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2">
            <div style={{ background: BONE }} className="p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-black/45">Reference range</div>
              <div className="mt-2 text-2xl font-black tracking-tight">{marker.range}</div>
            </div>
            <div style={{ background: BONE }} className="p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-black/45">Direction</div>
              <div className="mt-2 text-2xl font-black tracking-tight">{marker.interpretation}</div>
            </div>
          </div>

          <Section n="01" title="Your reading">
            <p className="text-[14.5px] leading-relaxed text-black/70">{marker.reading}</p>
          </Section>

          <Section n="02" title="What may help">
            <ul className="space-y-3">
              {marker.mayHelp.map((item) => (
                <li key={item} className="flex gap-3 text-[14.5px] leading-relaxed text-black/70">
                  <span className="opacity-45">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section n="03" title="When to talk to a doctor">
            <p className="text-[14.5px] leading-relaxed text-black/70">{marker.whenToTalkToDoctor}</p>
          </Section>

          <p className="mt-14 border-t border-black/10 pt-6 text-[12.5px] leading-relaxed text-black/55">
            Source:{" "}
            <a
              href={marker.source.url}
              className="font-medium text-black"
              style={{ boxShadow: `inset 0 -0.5em 0 ${LIME}` }}
            >
              {marker.source.org}
            </a>
            . Reference ranges are standard adult intervals — your own lab may report a different range for your age,
            sex, or method. This isn&apos;t medical advice; always go by the range on your actual results and talk to a
            clinician about anything that concerns you.
          </p>

          <div className="mt-12 border-t border-black/10 pt-8">
            <div className="font-mono text-[10px] uppercase tracking-widest text-black/45">Other markers</div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              {markers
                .filter((m) => m.slug !== marker.slug)
                .map((m) => (
                  <Link key={m.slug} href={`/labs/${m.slug}`} className="text-[13.5px] font-medium text-black/70 transition hover:text-black">
                    {m.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 border-b border-black/10 py-9 md:grid-cols-[3rem_1fr_1.6fr] md:gap-8">
      <div className="font-mono text-[10px] tracking-widest text-black/35">{n}</div>
      <h2 className="text-[19px] font-bold leading-snug">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
