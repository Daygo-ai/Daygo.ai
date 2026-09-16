"use client";

import { useActionState } from "react";
import { updateFreeMessageConfig } from "./actions";

export function FreeMessageConfig({ limit, mode }: { limit: number; mode: string }) {
  const [state, formAction, pending] = useActionState(updateFreeMessageConfig, { error: undefined });

  return (
    <form action={formAction} style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
      <div>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>Free messages</label>
        <input
          type="number"
          name="limit"
          min={0}
          defaultValue={limit}
          style={{ padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8, width: 100, color: "#111", background: "#fff" }}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>Resets</label>
        <select
          name="mode"
          defaultValue={mode}
          style={{ padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8, color: "#111", background: "#fff" }}
        >
          <option value="lifetime">Never (one-time taste)</option>
          <option value="daily">Every day (real free tier)</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: "9px 16px",
          borderRadius: 8,
          border: "none",
          background: "#111",
          color: "#fff",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {state.error ? <span style={{ color: "#c0392b", fontSize: 13 }}>{state.error}</span> : null}
    </form>
  );
}
