"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { error: undefined });

  return (
    <form
      action={formAction}
      style={{
        colorScheme: "light",
        maxWidth: 320,
        margin: "20vh auto",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: "system-ui, sans-serif",
        color: "#111",
      }}
    >
      <h1 style={{ fontSize: 18, fontWeight: 600 }}>Daygo admin</h1>
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoFocus
        style={{ padding: "10px 12px", border: "1px solid #ccc", borderRadius: 8, color: "#111", background: "#fff" }}
      />
      {state.error ? <p style={{ color: "#c0392b", fontSize: 13, margin: 0 }}>{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          border: "none",
          background: "#111",
          color: "#fff",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
