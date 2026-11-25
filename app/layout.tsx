import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://daygo.ai"),
  // Bing Webmaster Tools ownership check.
  verification: { other: { "msvalidate.01": "ECF9710993F16857AF8FAE383A278345" } },
  title: "Daygo — Your health, between visits",
  description:
    "Daygo connects patients and their clinic: your watch, blood tests and how you feel in one app, and, with your consent, a clear view for your clinician between visits.",
  openGraph: {
    title: "Daygo — Your health, between visits",
    description:
      "An AI coach that remembers you, holds you accountable, and tells you what today actually needs.",
    url: "https://daygo.ai",
    siteName: "Daygo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daygo — Your health, between visits",
    description:
      "An AI coach that remembers you, holds you accountable, and tells you what today actually needs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
