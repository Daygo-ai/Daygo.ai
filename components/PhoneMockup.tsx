/**
 * iPhone-frame mockup of the Daygo Today screen, rendered in pure
 * HTML/CSS so we don't have to ship a screenshot binary. Swap with a
 * real screenshot later — the surrounding hero layout doesn't change.
 *
 * Visual emphasis: the verdict number, the lime accent on key cards,
 * the small "live" pulse on the streaming indicator. Whoop-style: the
 * device leans, glows under it, content drifts in.
 */
export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] sm:w-[340px] md:w-[360px]">
      {/* Glow under the device */}
      <div
        className="absolute -inset-12 -z-10 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.55), rgba(200,255,85,0.10) 60%, transparent 75%)",
        }}
      />

      {/* Phone frame */}
      <div className="rounded-[44px] border border-white/10 bg-black p-2 shadow-2xl shadow-black/60 ring-1 ring-white/5">
        <div className="overflow-hidden rounded-[36px] bg-[var(--color-bg-elevated)]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pb-2 pt-3 text-[10px] font-medium text-white/80">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span className="block h-2 w-3 rounded-sm bg-white/70" />
              <span className="block h-2 w-3 rounded-sm bg-white/70" />
              <span className="block h-2 w-5 rounded-sm bg-[var(--color-accent)]" />
            </div>
          </div>

          {/* Header row */}
          <div className="flex items-center justify-between px-5 pt-2">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-white/40">
                Today
              </div>
              <div className="mt-0.5 text-base font-semibold">Hi, Marijus</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-white/10" />
              <div className="h-7 w-7 rounded-full bg-white/10" />
              <div className="h-7 w-7 rounded-full bg-[var(--color-accent)]" />
            </div>
          </div>

          {/* Today's plan card (charcoal, lime accent) */}
          <div className="mx-3 mt-4 rounded-2xl border border-white/[0.06] bg-[#0F0F18] p-4">
            <div className="text-[9px] font-semibold uppercase tracking-widest text-white/50">
              Today&apos;s plan
            </div>
            <div className="mt-1.5 text-[17px] font-medium leading-tight">
              Easy day. Sleep led the recovery.
            </div>
            <div className="mt-2 text-[11px] leading-snug text-white/60">
              You slept 8h 12m, HRV is up 6ms. Body&apos;s in green —
              spend it on something that matters.
            </div>
            <ul className="mt-3 space-y-1.5">
              {["30-min easy walk", "Protein-forward lunch", "In bed by 22:30"].map(
                (a) => (
                  <li key={a} className="flex items-start gap-2 text-[11px]">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                    <span className="text-white/85">{a}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Hero verdict */}
          <div className="mx-3 mt-3 rounded-2xl border border-white/[0.06] bg-[#161620] p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-widest text-white/50">
                  Battery
                </div>
                <div className="mt-1 text-5xl font-medium tracking-tight text-white">
                  78
                </div>
              </div>
              <div className="text-[10px] font-semibold text-[var(--color-accent)]">
                ↑ 13 vs avg
              </div>
            </div>
            {/* Faux trend line */}
            <svg
              viewBox="0 0 200 50"
              className="mt-3 h-10 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,38 C20,32 35,28 55,22 C75,18 100,30 130,25 C160,20 180,12 200,8"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="200" cy="8" r="3" fill="var(--color-accent)" />
            </svg>
          </div>

          {/* Tile grid */}
          <div className="mx-3 my-3 grid grid-cols-2 gap-2">
            {[
              { label: "Sleep", value: "8h 12m", sub: "↑ on target" },
              { label: "HRV", value: "62", unit: "ms", sub: "+6 vs avg" },
              { label: "Resting HR", value: "54", unit: "bpm", sub: "−2 vs avg" },
              { label: "Workout", value: "Run", unit: "42m" },
            ].map((t) => (
              <div
                key={t.label}
                className="rounded-xl border border-white/[0.06] bg-[#181822] p-3"
              >
                <div className="text-[8px] font-semibold uppercase tracking-widest text-white/50">
                  {t.label}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[17px] font-medium">{t.value}</span>
                  {t.unit && (
                    <span className="text-[10px] text-white/60">{t.unit}</span>
                  )}
                </div>
                {t.sub && (
                  <div className="mt-1 text-[9px] text-[var(--color-accent)]">
                    {t.sub}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
