"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroTodayCard } from "@/components/DaygoMock";

/**
 * iPhone-15-Pro-style phone frame with the real Daygo iOS app
 * cycling inside. CSS-only mock; values & visual signature traced
 * directly from the SwiftUI source so the hero shows what the real
 * app actually looks like.
 *
 * The actual app has 3 tabs (Today / Chat / History) with a custom
 * pill-shaped BottomNav. We cycle through Today and Chat (the two
 * surfaces a marketing visitor cares about) and end on History.
 *
 * Theme tokens mirror Theme.Color in iOS:
 *   bg            #0A0A0A      surface          #141414
 *   surfaceElev   #1E1E1E      accent (lime)    #D4FF4A
 *   ink           #161913      ink-soft         #2A2D22
 *   onAccent      #161913      textSecondary    #A6A6A6
 *   divider       rgba(255,255,255,0.08)
 *
 * Card radii: card=28, hero=32, pill=999. Hero card uses lime accent.
 */

// --- Sizing ---------------------------------------------------------------
const PHONE_W = 300;
const PHONE_H = Math.round(PHONE_W / 0.461);
const SCREEN_INSET = 6;
const SCREEN_W = PHONE_W - SCREEN_INSET * 2;
const SCREEN_H = PHONE_H - SCREEN_INSET * 2;

// --- Theme ----------------------------------------------------------------
const T = {
  bg: "#0A0A0A",
  surface: "#141414",
  surfaceElevated: "#1E1E1E",
  accent: "#D4FF4A",
  onAccent: "#000",
  primary: "#CDEE3C",
  primaryLight: "#DDFF55",
  primaryDeep: "#A8C820",
  text: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.65)",
  textMuted: "rgba(255,255,255,0.45)",
  divider: "rgba(255,255,255,0.08)",
};

export function PhoneMock({ tilt = true }: { tilt?: boolean }) {
  return (
    <div
      className="relative"
      style={{ width: PHONE_W, height: PHONE_H, perspective: "1500px" }}
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: tilt ? "rotateY(-10deg) rotateX(3deg)" : "none",
          transformStyle: "preserve-3d",
        }}
      >
        <SideButtons />

        {/* Chassis: titanium gradient */}
        <div
          className="absolute inset-0 rounded-[38px]"
          style={{
            background:
              "linear-gradient(135deg, #3a3a3e 0%, #1f1f23 45%, #2c2c30 100%)",
            boxShadow:
              "0 30px 80px -10px rgba(0,0,0,0.65), 0 12px 30px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        />

        {/* Inner bezel */}
        <div
          className="absolute rounded-[32px]"
          style={{
            inset: SCREEN_INSET,
            background: "#000",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        />

        {/* Screen */}
        <div
          className="absolute overflow-hidden rounded-[30px]"
          style={{
            inset: SCREEN_INSET + 1,
            width: SCREEN_W - 2,
            height: SCREEN_H - 2,
            background: T.bg,
          }}
        >
          {/* The real Daygo Today screen, rendered — not a stock photo.
              Shows the product a visitor actually gets. */}
          <div className="absolute inset-0 z-10 overflow-hidden bg-accent p-3">
            <HeroTodayCard />
          </div>
          <div
            className="pointer-events-none absolute bottom-1.5 left-1/2 z-40 h-[5px] w-[110px] -translate-x-1/2 rounded-full"
            style={{ background: "rgba(255,255,255,0.85)" }}
          />
        </div>
      </div>
    </div>
  );
}

function SideButtons() {
  const btn = (
    top: number,
    height: number,
    side: "left" | "right",
  ): React.CSSProperties => ({
    position: "absolute",
    [side]: -2,
    top,
    width: 3,
    height,
    borderRadius: 2,
    background: "linear-gradient(180deg, #4a4a4e, #2a2a2e)",
  });
  return (
    <>
      <span style={btn(110, 32, "left")} />
      <span style={btn(152, 56, "left")} />
      <span style={btn(140, 72, "right")} />
    </>
  );
}

function StatusBar() {
  return (
    <div
      className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-[10px] text-[11px] font-semibold"
      style={{ color: T.text }}
    >
      <span style={{ fontVariantNumeric: "tabular-nums" }}>9:41</span>
      <div className="flex items-center gap-1">
        <svg width="15" height="9" viewBox="0 0 15 9">
          <rect x="0" y="6" width="2.4" height="3" rx="0.6" fill="white" />
          <rect x="3.4" y="4" width="2.4" height="5" rx="0.6" fill="white" />
          <rect x="6.8" y="2" width="2.4" height="7" rx="0.6" fill="white" />
          <rect x="10.2" y="0" width="2.4" height="9" rx="0.6" fill="white" />
        </svg>
        <svg width="14" height="10" viewBox="0 0 14 10">
          <path
            d="M7 9.6a1.05 1.05 0 110-2.1 1.05 1.05 0 010 2.1zM3.5 6.4a4.95 4.95 0 017 0l-1 1a3.55 3.55 0 00-5 0l-1-1zM.7 3.6a8.94 8.94 0 0112.6 0l-1 1a7.54 7.54 0 00-10.6 0l-1-1z"
            fill="white"
          />
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11">
          <rect
            x="0.5"
            y="0.5"
            width="20"
            height="10"
            rx="2.5"
            stroke="white"
            strokeOpacity="0.4"
            fill="none"
          />
          <rect x="2" y="2" width="17" height="7" rx="1.5" fill="white" />
          <rect
            x="21.4"
            y="3.5"
            width="1.4"
            height="4"
            rx="0.5"
            fill="white"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}

// --- AppFlow: cycles 3 real Daygo tabs ------------------------------------
type Tab = "today" | "chat" | "history";
const TAB_DURATIONS: Record<Tab, number> = {
  today: 5500,
  chat: 5500,
  history: 4500,
};
const TAB_ORDER: Tab[] = ["today", "chat", "history"];

function AppFlow() {
  const [idx, setIdx] = useState(0);
  const tab = TAB_ORDER[idx];

  useEffect(() => {
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % TAB_ORDER.length);
    }, TAB_DURATIONS[tab]);
    return () => clearTimeout(t);
  }, [idx, tab]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {tab === "today" && <TodayScreen />}
          {tab === "chat" && <ChatScreen />}
          {tab === "history" && <HistoryScreen />}
        </motion.div>
      </AnimatePresence>
      <BottomNav active={tab} />
    </>
  );
}

// --- BottomNav: matches the real iOS pill-shaped BottomNav ----------------
function BottomNav({ active }: { active: Tab }) {
  const tabs: { k: Tab; label: string; icon: "today" | "chat" | "history" }[] = [
    { k: "today", label: "Today", icon: "today" },
    { k: "chat", label: "Chat", icon: "chat" },
    { k: "history", label: "History", icon: "history" },
  ];
  return (
    <div className="absolute inset-x-3 bottom-7 z-30">
      <div
        className="flex items-center gap-1 rounded-full p-1.5"
        style={{
          background: T.surface,
          border: `1px solid ${T.divider}`,
        }}
      >
        {tabs.map((t) => {
          const on = t.k === active;
          return (
            <motion.div
              key={t.k}
              layout
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2"
              style={{
                background: on ? T.accent : "transparent",
                color: on ? T.onAccent : T.textSecondary,
              }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
            >
              <NavIcon kind={t.icon} on={on} />
              {on && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[11px] font-semibold"
                >
                  {t.label}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function NavIcon({ kind, on }: { kind: "today" | "chat" | "history"; on: boolean }) {
  const color = on ? T.onAccent : T.textSecondary;
  if (kind === "today")
    return (
      // house.fill — flat with simple roof
      <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
        <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7H10v7H6a2 2 0 01-2-2v-9z" />
      </svg>
    );
  if (kind === "chat")
    return (
      // bubble.left.fill
      <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
        <path d="M5 4h14a3 3 0 013 3v9a3 3 0 01-3 3h-9l-5 4v-4H5a3 3 0 01-3-3V7a3 3 0 013-3z" />
      </svg>
    );
  // clock.fill
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="12" r="9" />
      <path
        d="M12 7v5l3.5 2"
        stroke={on ? T.accent : T.bg}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// --- Screen 1: Today ------------------------------------------------------
// Mirrors HeroCard.swift — purple gradient hero with massive battery
// percentage, lime underline capsule, delta pill, verdict label,
// then a small one-liner. Below it, a TodayPlanCard echo.
function TodayScreen() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="px-4 pt-2 pb-[78px]">
        <ScreenHeader title="Daygo" />
        <HeroCard />
        <div className="mt-2.5">
          <TodayPlanCard />
        </div>
      </div>
    </div>
  );
}

function ScreenHeader({ title }: { title: string }) {
  return (
    <div className="mb-2 flex items-center justify-between px-1 py-1">
      <div className="flex items-center gap-1.5">
        <span
          className="block h-4 w-4 rounded-full"
          style={{ background: T.primary }}
        >
          <span
            className="mx-auto mt-1 block h-1.5 w-1.5 rounded-full"
            style={{ background: T.accent }}
          />
        </span>
        <span
          className="text-[12px] font-semibold tracking-tight"
          style={{ color: T.text }}
        >
          {title}
        </span>
      </div>
      <span
        className="grid h-6 w-6 place-items-center rounded-full"
        style={{ background: T.surface }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke={T.textSecondary} strokeWidth="1.6" />
          <path
            d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"
            stroke={T.textSecondary}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
}

function HeroCard() {
  // Animate the battery number from 0 → 72 once on mount.
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1100);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(72 * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="relative overflow-hidden p-4"
      style={{
        borderRadius: 24,
        background: `linear-gradient(135deg, ${T.primaryLight} 0%, ${T.primary} 45%, ${T.primaryDeep} 100%)`,
      }}
    >
      <div
        className="text-[9px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        Today
      </div>

      <div className="mt-1.5 flex items-start justify-between">
        <div>
          <div
            className="flex items-baseline leading-none"
            style={{ color: T.text }}
          >
            <span
              className="font-medium"
              style={{
                fontSize: 56,
                letterSpacing: "-0.04em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {n}
            </span>
            <span
              className="font-medium"
              style={{
                fontSize: 28,
                opacity: 0.7,
                letterSpacing: "-0.03em",
              }}
            >
              %
            </span>
          </div>
          {/* Short lime underline capsule */}
          <div
            className="mt-1.5 h-[3px] w-[42px] rounded-full"
            style={{ background: T.accent }}
          />
        </div>

        {/* Delta pill */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-1 rounded-full px-2 py-1"
          style={{ background: T.accent, color: T.onAccent }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8">
            <path d="M4 1l3 3H5v3H3V4H1l3-3z" fill={T.onAccent} />
          </svg>
          <span className="text-[10px] font-bold">3% vs yesterday</span>
        </motion.div>
      </div>

      <div
        className="mt-3 font-medium leading-tight"
        style={{ fontSize: 18, color: T.text, letterSpacing: "-0.02em" }}
      >
        Take it easy
      </div>
      <div
        className="mt-1 text-[11px] leading-snug"
        style={{ color: "rgba(255,255,255,0.85)" }}
      >
        Sleep was rough — short and broken. Your body&apos;s still catching
        up.
      </div>

      {/* Mini trend sparkline */}
      <svg viewBox="0 0 240 32" className="mt-3 h-[28px] w-full">
        <motion.path
          d="M0,22 C30,18 50,26 80,16 C110,8 140,18 170,12 C200,8 220,12 240,6"
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
        />
        <motion.circle
          cx="240"
          cy="6"
          r="3"
          fill={T.accent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
        />
      </svg>
    </div>
  );
}

function TodayPlanCard() {
  // Subtle dark gradient to match TodayPlanCard.swift's
  // [Color(white: 0.10), Color.black] gradient.
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className="relative overflow-hidden p-3.5"
      style={{
        borderRadius: 24,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(0,0,0,1))",
        border: `1px solid ${T.divider}`,
      }}
    >
      <div
        className="text-[9px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        Today&apos;s plan
      </div>
      <div
        className="mt-1.5 font-medium leading-tight"
        style={{ fontSize: 15, color: T.text, letterSpacing: "-0.02em" }}
      >
        Easy day. Protect Thursday.
      </div>
      <ul className="mt-2 space-y-1">
        {[
          "Easy Z2 run · 30 min, max HR 148",
          "Last coffee by 13:00",
          "In bed by 22:30",
        ].map((a, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.15 }}
            className="flex items-start gap-2"
          >
            <span
              className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: T.accent }}
            />
            <span className="text-[11px]" style={{ color: T.text }}>
              {a}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

// --- Screen 2: Chat (document-style, matches MessageBubble.swift) ---------
function ChatScreen() {
  type M = { role: "user" | "ai"; text: string };
  const [shown, setShown] = useState<M[]>([]);
  const [streamed, setStreamed] = useState("");
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const stream = async (text: string, cps = 90) => {
      setStreaming(true);
      setStreamed("");
      for (let i = 1; i <= text.length; i++) {
        if (cancelled) return;
        setStreamed(text.slice(0, i));
        await sleep(1000 / cps);
      }
      setStreaming(false);
    };

    (async () => {
      await sleep(500);
      if (cancelled) return;
      setShown([{ role: "user", text: "Should I run today?" }]);
      await sleep(550);
      if (cancelled) return;
      const reply =
        "Easy run only. HRV is down 12% and your RHR is 4 bpm above your norm. Skip the 8×500m and swap it to Thursday.";
      await stream(reply);
      if (cancelled) return;
      // Commit the streamed text into history
      setShown((s) => [...s, { role: "ai", text: reply }]);
      setStreamed("");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="flex h-full flex-col px-4 pt-1 pb-[88px]">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <span
            className="font-medium"
            style={{ fontSize: 22, color: T.text, letterSpacing: "-0.02em" }}
          >
            Chat
          </span>
          <span
            className="grid h-7 w-7 place-items-center rounded-full"
            style={{ background: T.surface }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 4v5h5M20 20v-5h-5"
                stroke={T.textSecondary}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 9a7 7 0 0111-2M15 15a7 7 0 01-11 2"
                stroke={T.textSecondary}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>

        {/* Messages — document style, no bubbles */}
        <div className="flex-1 space-y-3 overflow-hidden">
          {shown.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end pl-8">
                <span
                  className="text-right text-[12.5px] leading-snug"
                  style={{ color: T.text }}
                >
                  {m.text}
                </span>
              </div>
            ) : (
              <div key={i} className="text-[12.5px] leading-snug" style={{ color: T.text }}>
                {m.text}
              </div>
            ),
          )}
          {streamed && (
            <div className="text-[12.5px] leading-snug" style={{ color: T.text }}>
              {streamed}
              {streaming && (
                <motion.span
                  className="inline-block"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  style={{ color: T.accent }}
                >
                  {" "}●
                </motion.span>
              )}
            </div>
          )}
        </div>

        {/* Composer */}
        <div
          className="flex items-center gap-2 rounded-2xl px-3 py-2"
          style={{ background: T.surface, border: `1px solid ${T.divider}` }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 6v12M6 12h12"
              stroke={T.textSecondary}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="flex-1 text-[11px]" style={{ color: T.textMuted }}>
            Ask anything…
          </span>
          <span
            className="grid h-7 w-7 place-items-center rounded-full"
            style={{ background: T.surfaceElevated }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={T.textSecondary}>
              <path d="M12 2a3 3 0 013 3v6a3 3 0 11-6 0V5a3 3 0 013-3zM5 11a7 7 0 0014 0M12 18v3" stroke={T.textSecondary} strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          <span
            className="grid h-7 w-7 place-items-center rounded-full"
            style={{ background: T.accent }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke={T.onAccent}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Screen 3: History (logs list) ----------------------------------------
function HistoryScreen() {
  const items: { day: string; date: string; battery: number; verdict: string; note: string }[] = [
    { day: "Today", date: "May 6", battery: 72, verdict: "Take it easy", note: "Sleep was short and broken." },
    { day: "Mon", date: "May 5", battery: 81, verdict: "Go for it", note: "Z2 run, felt good throughout." },
    { day: "Sun", date: "May 4", battery: 68, verdict: "Maintain", note: "Recovery + mobility." },
    { day: "Sat", date: "May 3", battery: 58, verdict: "Take it easy", note: "Travel day · 8h shift." },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="px-4 pt-1 pb-[88px]">
        <div className="mb-3 flex items-center justify-between">
          <span
            className="font-medium"
            style={{ fontSize: 22, color: T.text, letterSpacing: "-0.02em" }}
          >
            History
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[9.5px] font-semibold"
            style={{
              background: "rgba(212,255,74,0.16)",
              color: T.accent,
              letterSpacing: "0.06em",
            }}
          >
            7 DAYS
          </span>
        </div>

        <ul className="space-y-2">
          {items.map((it, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex items-center gap-3 rounded-2xl p-2.5"
              style={{ background: T.surface, border: `1px solid ${T.divider}` }}
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: T.surfaceElevated }}>
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: it.battery >= 70 ? T.accent : T.text, fontVariantNumeric: "tabular-nums" }}
                >
                  {it.battery}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11.5px] font-semibold" style={{ color: T.text }}>
                    {it.day}
                  </span>
                  <span className="text-[10px]" style={{ color: T.textMuted }}>
                    {it.date}
                  </span>
                </div>
                <div className="text-[10.5px]" style={{ color: T.textSecondary }}>
                  <span style={{ color: it.battery >= 70 ? T.accent : T.text }}>
                    {it.verdict}
                  </span>
                  <span> · {it.note}</span>
                </div>
              </div>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke={T.textMuted}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
