import type { Metadata } from "next";
import SafeAnalytics from "@/components/SafeAnalytics";
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
      "Your watch, blood tests and how you feel in one app, and a clear view for your clinic between visits.",
    url: "https://daygo.ai",
    siteName: "Daygo",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Daygo — Between visits" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daygo — Your health, between visits",
    description:
      "Your watch, blood tests and how you feel in one app, and a clear view for your clinic between visits.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // lang is switched to "lt" on /lt pages by HtmlLang before hydration
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <SafeAnalytics />
      </body>
    </html>
  );
}
