"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/**
 * Mini auto-playing chat demo for the landing page. Mimics the
 * Daygo iOS chat: user types into the composer, message sends, AI
 * "thinks" with three dots, then streams its reply word-by-word.
 *
 * Triggers each time the section enters the viewport (so people who
 * scroll back see it again). Cancellation guard ensures the
 * setTimeout chain stops cleanly if the user leaves the section
 * mid-stream.
 */
type Turn = { role: "user" | "ai"; text: string };

const SCRIPT: { role: "user" | "ai"; text: string; cps: number; pauseAfter?: number }[] = [
  {
    role: "user",
    text: "Should I run today? I'm feeling OK but a bit tired.",
    cps: 32,
    pauseAfter: 450,
  },
  {
    role: "ai",
    text: "Easy run, max 35 min. HRV is up but you slept 6h 50m two nights ago and your resting heart rate is still 4 bpm above normal. Don't add tempo.",
    cps: 90,
    pauseAfter: 600,
  },
  {
    role: "ai",
    text: "You said this Sunday you wanted four runs this week. Two done — easy run today keeps you on pace.",
    cps: 90,
    pauseAfter: 900,
  },
  // Follow-up: user pushes back. The coach holds the line and gives
  // a concrete swap — the kind of specific, data-grounded answer
  // the rest of the marketing page is promising.
  {
    role: "user",
    text: "But today was meant to be intervals. 8 × 500m at 3:30.",
    cps: 32,
    pauseAfter: 450,
  },
  {
    role: "ai",
    text: "Skip the intervals today. 3:30 × 8 reps is threshold work — exactly what punishes a tired system. Swap it with Thursday when your numbers should be back.",
    cps: 90,
    pauseAfter: 600,
  },
  {
    role: "ai",
    text: "If you really need speed, 4 × 200m at the same pace with full rest gets you the feel for half the cost.",
    cps: 90,
    pauseAfter: 1400,
  },
];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function AnimatedChat() {
  const containerRef = useRef<HTMLDivElement>(null);
  // amount: 0.4 → fire when at least 40% of the chat panel is in view.
  // Fires on every entry so scrolling back replays the conversation.
  const inView = useInView(containerRef, { amount: 0.4 });

  const [history, setHistory] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  // Tracks whether the AI is currently streaming the latest reply,
  // so we can show a caret on it.
  const [streamingAi, setStreamingAi] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;

    // Reset to a clean slate each time we (re-)enter view.
    setHistory([]);
    setDraft("");
    setThinking(false);
    setStreamingAi(false);

    (async function play() {
      // Brief beat before the user starts typing so the empty state
      // is registered visually.
      await sleep(700);
      if (cancelled) return;

      for (const turn of SCRIPT) {
        if (cancelled) return;

        if (turn.role === "user") {
          // Type characters into the composer.
          for (let i = 1; i <= turn.text.length; i++) {
            if (cancelled) return;
            setDraft(turn.text.slice(0, i));
            await sleep(1000 / turn.cps);
          }
          await sleep(turn.pauseAfter ?? 400);
          if (cancelled) return;
          setHistory((h) => [...h, { role: "user", text: turn.text }]);
          setDraft("");
        } else {
          // Thinking dots, then stream the reply.
          setThinking(true);
          await sleep(1100);
          if (cancelled) return;
          setThinking(false);
          setStreamingAi(true);
          setHistory((h) => [...h, { role: "ai", text: "" }]);
          for (let i = 1; i <= turn.text.length; i++) {
            if (cancelled) return;
            setHistory((h) => {
              const copy = [...h];
              copy[copy.length - 1] = { role: "ai", text: turn.text.slice(0, i) };
              return copy;
            });
            await sleep(1000 / turn.cps);
          }
          setStreamingAi(false);
          await sleep(turn.pauseAfter ?? 500);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inView]);

  return (
    <div
      ref={containerRef}
      className="card-glass relative rounded-3xl p-5"
    >
      <div className="min-h-[480px] space-y-3">
        <AnimatePresence initial={false}>
          {history.map((m, i) => {
            const isLast = i === history.length - 1;
            const showCaret = m.role === "ai" && isLast && streamingAi;
            return (
              <motion.div
                key={`${m.role}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-snug ${
                    m.role === "user"
                      ? "bg-accent text-accent-on"
                      : "bg-bg-elevated text-white/90"
                  }`}
                >
                  {m.text}
                  {showCaret && <Caret tone="ai" />}
                </div>
              </motion.div>
            );
          })}
          {thinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex justify-start"
            >
              <div className="rounded-2xl bg-bg-elevated px-4 py-3">
                <ThinkingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-bg-elevated px-4 py-2.5 text-sm">
        <span className="min-w-0 flex-1 truncate text-white/85">
          {draft.length > 0 ? (
            <>
              {draft}
              <Caret tone="user" />
            </>
          ) : (
            <span className="text-white/40">Ask anything…</span>
          )}
        </span>
        <span className="ml-auto h-6 w-6 shrink-0 rounded-full bg-accent" />
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-white/65"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{
            duration: 1.0,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function Caret({ tone }: { tone: "user" | "ai" }) {
  return (
    <motion.span
      className={`ml-0.5 inline-block h-3.5 w-[1.5px] align-middle ${
        tone === "user" ? "bg-white" : "bg-white/80"
      }`}
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.9, repeat: Infinity }}
    />
  );
}
