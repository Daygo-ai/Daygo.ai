import { ImageResponse } from "next/og";

// The preview card shown when daygo.ai is shared on LinkedIn, X, iMessage…
export const alt = "Daygo — your body, in plain English";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
        padding: 80, background: "#0b0c0b", color: "#f4f1ea" }}>
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 6, color: "#cdee3c" }}>DAYGO</div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02, marginTop: 28, maxWidth: 980 }}>
          Your body, in plain English.
        </div>
        <div style={{ fontSize: 32, marginTop: 30, color: "rgba(244,241,234,0.65)", maxWidth: 940 }}>
          An AI health coach built on your sleep, training, food and lab work.
        </div>
      </div>
    ),
    size,
  );
}
