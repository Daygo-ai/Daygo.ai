"use client";

import { useActionState } from "react";
import { grantPro, revokePro } from "./actions";

export function ProGrants({ grants }: { grants: { userId: string; email: string; grantedAt: string }[] }) {
  const [state, formAction, pending] = useActionState(grantPro, { error: undefined });

  return (
    <div>
      <form action={formAction} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input
          type="email"
          name="email"
          placeholder="email@example.com"
          required
          style={{ padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8, minWidth: 260, color: "#111", background: "#fff" }}
        />
        <button
          type="submit"
          disabled={pending}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: "#111",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {pending ? "Granting…" : "Grant free Pro"}
        </button>
        {state.error ? <span style={{ color: "#c0392b", fontSize: 13 }}>{state.error}</span> : null}
      </form>

      {grants.length === 0 ? (
        <p style={{ fontSize: 13, color: "#666" }}>No manual grants yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "6px 8px", color: "#666" }}>Email</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "6px 8px", color: "#666" }}>Granted</th>
              <th style={{ borderBottom: "1px solid #eee", padding: "6px 8px" }} />
            </tr>
          </thead>
          <tbody>
            {grants.map((g) => (
              <tr key={g.userId}>
                <td style={{ borderBottom: "1px solid #f5f5f5", padding: "6px 8px" }}>{g.email}</td>
                <td style={{ borderBottom: "1px solid #f5f5f5", padding: "6px 8px" }}>
                  {new Date(g.grantedAt).toLocaleDateString()}
                </td>
                <td style={{ borderBottom: "1px solid #f5f5f5", padding: "6px 8px", textAlign: "right" }}>
                  <button
                    onClick={() => revokePro(g.userId)}
                    style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: 13 }}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
