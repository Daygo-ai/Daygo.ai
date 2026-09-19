import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { markers } from "@/lib/markers";
import { BONE } from "@/lib/brand";
import Link from "next/link";

export const metadata = {
  title: "Lab markers explained, in plain English — Daygo",
  description: "What your lab values actually mean, what's normal, and what may help — one page per marker.",
};

export default function LabsIndexPage() {
  return (
    <>
      <Nav />
      <main style={{ background: BONE }} className="px-6 py-16 text-black md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-black/45">
            <span>Lab markers</span>
            <span>
              01 — {markers.length < 10 ? "0" : ""}
              {markers.length}
            </span>
          </div>

          <h1 className="mt-8 text-[12vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[7vw] md:text-[3.7rem]">
            Lab markers,
            <br />
            in plain English.
          </h1>
          <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-black/65">
            What each marker actually measures, what&apos;s normal, and what may help — the same interpretation Daygo
            gives you in the app, written out here.
          </p>

          <div className="mt-14 border-t border-black/10">
            {markers.map((m, i) => (
              <Link
                key={m.slug}
                href={`/labs/${m.slug}`}
                className="group grid gap-2 border-b border-black/10 py-7 transition hover:bg-black/[0.03] md:grid-cols-[3rem_1.2fr_1fr_auto] md:items-baseline md:gap-8"
              >
                <div className="font-mono text-[10px] tracking-widest text-black/35">
                  {i < 9 ? "0" : ""}
                  {i + 1}
                </div>
                <h2 className="text-[19px] font-bold leading-snug">{m.name}</h2>
                <div className="font-mono text-[10px] uppercase tracking-widest text-black/50">{m.category}</div>
                <div className="font-mono text-[11px] tracking-wider text-black/70">{m.range}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
