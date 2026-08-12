"use client";

// Submits to our own /api/subscribe route, which calls Mailchimp's
// Marketing API server-side (see app/api/subscribe/route.ts). Keeps the
// API key off the client and surfaces success/error as a toast instead
// of bouncing the visitor to a Mailchimp-hosted page.
import { useRef, useState } from "react";
import { toast } from "@/components/ui/toast";

const SUBMIT_COOLDOWN_MS = 2000;

export function WaitlistForm({
  ink,
  lime,
}: {
  ink: string;
  lime: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const lastSubmitAt = useRef(0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const now = Date.now();
    if (loading || now - lastSubmitAt.current < SUBMIT_COOLDOWN_MS) {
      return;
    }
    lastSubmitAt.current = now;
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.add({
          title: data.error ?? "Something went wrong. Please try again.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: data.alreadySubscribed
          ? "You're already on the list!"
          : "You're in! Check your inbox to confirm your spot.",
        type: "success",
      });
      setEmail("");
    } catch {
      toast.add({
        title: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        type="email"
        name="EMAIL"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        aria-label="Email address"
        disabled={loading}
        className="w-full rounded-full border px-5 py-3 text-sm outline-none transition sm:max-w-[240px]"
        style={{
          background: "#ffffff88",
          borderColor: `${ink}33`,
          color: ink,
        }}
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
        style={{ background: ink, color: lime }}
      >
        {loading ? "Joining…" : "Join the waitlist"}
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}
