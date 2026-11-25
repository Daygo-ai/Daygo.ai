import type { Metadata } from "next";

// Static snapshot of the earlier home-page clinic card (three rows, sans
// "CLINICS"), kept for social posts. Not linked anywhere and not indexed.
// Export: render this page at 1300x800 with a 2x device scale factor.

export const metadata: Metadata = {
  title: "Daygo for clinics",
  robots: { index: false, follow: false },
};

const ROWS = [
  ["Trends, not snapshots", "Sleep, HRV, resting heart rate and labs against each patient's own baseline."],
  ["Visit prep in a minute", "A ready summary of what changed since the last visit."],
  ["Retests that happen", "Plans and reminders go to the app patients open every day."],
];

const MASK = {
  WebkitMaskImage: "url(/daygo-wordmark.webp), linear-gradient(#000, #000)",
  maskImage: "url(/daygo-wordmark.webp), linear-gradient(#000, #000)",
  WebkitMaskSize: "86% auto, 100% 100%",
  maskSize: "86% auto, 100% 100%",
  WebkitMaskPosition: "50% 15%, 0 0",
  maskPosition: "50% 15%, 0 0",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as React.CSSProperties;

function Chevron() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-white/40">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function ClinicCardShare() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8" style={{ background: "#F2F1EC" }}>
      {/* hide the Next.js dev badge so exports are clean */}
      <style>{`nextjs-portal{display:none!important}`}</style>
      <div className="relative w-full max-w-[1240px] overflow-hidden rounded-[24px] text-white" style={{ background: "#d9d6d2", aspectRatio: "1240 / 738" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/clinic/mountain-peak.jpg" alt="" className="absolute inset-y-0 left-0 h-full w-1/2 object-cover object-[50%_45%]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/clinic/mountain-peak.jpg" alt="" className="absolute inset-y-0 right-0 h-full w-1/2 object-cover object-[50%_40%]" style={{ transform: "scale(1.1)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/15" />

        <div className="relative z-10 flex h-full w-1/2 flex-col justify-between border-r border-white/25 px-10 pb-10 pt-8">
          <div aria-hidden className="absolute inset-0 -z-10 bg-neutral-500/20 backdrop-blur-[14px]" style={MASK} />

          <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
            <span>• For clinics</span>
            <span>• Between visits</span>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">Insight</p>
            <p className="mt-3 max-w-lg text-2xl leading-snug">
              One view of what changed for each patient since you last saw them.
              <span className="text-white/60"> Every visit starts from where they are, not from zero.</span>
            </p>

            <div className="mt-8 border-t border-white/20">
              {ROWS.map(([t, b], i) => (
                <div key={t} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-white/20 py-4">
                  <span className="pt-1 text-[10px] tracking-[0.15em] text-white/55">0{i + 1}</span>
                  <div>
                    <p className="flex items-center gap-1 text-[15px] font-medium">
                      {t} <Chevron />
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/65">{b}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1 rounded-full bg-white px-5 py-2.5 text-[11px] text-black">Daygo for clinics ›</span>
              <span className="text-white/80">• Clinic sign in</span>
              <span className="text-white/80">• hello@daygo.ai</span>
            </div>
          </div>
        </div>

        <span aria-hidden className="absolute right-8 top-8 z-10 text-lg" style={{ color: "#CDEE3C" }}>✱✱</span>
        <p
          aria-hidden
          className="absolute bottom-[-0.12em] right-3 z-10 select-none font-black uppercase leading-none tracking-tighter text-white"
          style={{ fontSize: "8.5rem" }}
        >
          Clinics
        </p>
      </div>
    </main>
  );
}
