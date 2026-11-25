"use client";

import { useActionState, useState } from "react";
import { sendBroadcast, type BroadcastState } from "./actions";

const input = { padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8, color: "#111", background: "#fff", width: "100%" } as const;
const label = { display: "block", fontSize: 12, color: "#666", marginBottom: 4 } as const;

/** Compose a notification, preview it as a lock-screen banner, send to a test account or everyone. */
export function Broadcast({ reach }: { reach: { users: number; devices: number } }) {
  const [state, action, pending] = useActionState<BroadcastState, FormData>(sendBroadcast, {});
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"test" | "everyone">("test");

  return (
    <form action={action} style={{ display: "grid", gap: 14, maxWidth: 560 }}>
      <div>
        <label style={label}>Title ({60 - title.length} left)</label>
        <input name="title" maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New in Daygo" style={input} />
      </div>
      <div>
        <label style={label}>Message ({240 - body.length} left)</label>
        <textarea
          name="body"
          maxLength={240}
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ask Daygo anything — it now suggests what to ask next."
          style={{ ...input, resize: "vertical" }}
        />
      </div>

      {/* how it shows on a lock screen */}
      <div style={{ background: "#1c1c1e", color: "#fff", borderRadius: 18, padding: "12px 14px", display: "flex", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: "#CDEE3C", flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{title || "Title"}</div>
          <div style={{ fontSize: 13, opacity: 0.85, whiteSpace: "pre-wrap" }}>{body || "Your message appears here."}</div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
        Shows on lock screens: no health details, names or numbers about a person.
      </p>

      <div style={{ display: "grid", gap: 8 }}>
        <label style={{ fontSize: 14 }}>
          <input type="radio" name="audience" value="test" checked={audience === "test"} onChange={() => setAudience("test")} /> Test: one account
        </label>
        {audience === "test" ? (
          <input name="testEmail" type="email" placeholder="your@email" style={{ ...input, maxWidth: 320 }} />
        ) : null}
        <label style={{ fontSize: 14 }}>
          <input type="radio" name="audience" value="everyone" checked={audience === "everyone"} onChange={() => setAudience("everyone")} /> Everyone with
          notifications on — {reach.users} {reach.users === 1 ? "person" : "people"}, {reach.devices} device{reach.devices === 1 ? "" : "s"}
        </label>
        {audience === "everyone" ? (
          <label style={{ fontSize: 13, color: "#c0392b" }}>
            <input type="checkbox" name="confirm" value="yes" /> I&apos;ve tested this and want to send it to everyone
          </label>
        ) : null}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          type="submit"
          disabled={pending}
          style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: "#111", color: "#fff", fontWeight: 500, cursor: "pointer" }}
        >
          {pending ? "Sending…" : audience === "everyone" ? "Send to everyone" : "Send test"}
        </button>
        {state.error ? <span style={{ color: "#c0392b", fontSize: 13 }}>{state.error}</span> : null}
        {state.result ? <span style={{ color: "#2e7d32", fontSize: 13 }}>{state.result}</span> : null}
      </div>
    </form>
  );
}
