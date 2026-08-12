import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL("https://daygo.ai"),
  title: "Daygo — Your body, in plain English",
  description:
    "An AI coach that remembers you, holds you accountable, and tells you what today actually needs — built on your sleep, food, training, and lab work.",
  openGraph: {
    title: "Daygo — Your body, in plain English",
    description:
      "An AI coach that remembers you, holds you accountable, and tells you what today actually needs.",
    url: "https://daygo.ai",
    siteName: "Daygo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daygo — Your body, in plain English",
    description:
      "An AI coach that remembers you, holds you accountable, and tells you what today actually needs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("dark font-sans", geist.variable)}>
      <body>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
