"use client";
import { Analytics } from "@vercel/analytics/react";

// Security review M16: invite codes, clinic and admin routes never reach analytics.
export default function SafeAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const path = new URL(event.url).pathname;
        return /^\/(join|clinic|admin)(\/|$)/.test(path) ? null : event;
      }}
    />
  );
}
