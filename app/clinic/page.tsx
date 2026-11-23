import type { Metadata } from "next";
import { Doto } from "next/font/google";
import ClinicApp from "./ClinicApp";

const dots = Doto({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-dots" });

export const metadata: Metadata = {
  title: "Daygo for Clinics · Sign in",
  description: "Sign in to the Daygo clinic dashboard.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={dots.variable}>
      <style>{`.font-dots{font-family:var(--font-dots),ui-monospace,monospace;font-weight:800;letter-spacing:-.02em}`}</style>
      <ClinicApp />
    </div>
  );
}
