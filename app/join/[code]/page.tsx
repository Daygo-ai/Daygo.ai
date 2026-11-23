import type { Metadata } from "next";
import { APP_STORE_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Join your clinic on Daygo",
  robots: { index: false, follow: false },
};

// Shown when a clinic invite link is opened without the app installed
// (with the app, iOS opens Daygo directly via universal links).
export default async function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw).toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 16);
  return (
    <main className="grid min-h-screen place-items-center bg-[#0A0A0A] px-5 text-[#F5F5F2]">
      <div className="w-full max-w-[420px] text-center">
        <img src="/daygo-white.svg" alt="Daygo" className="mx-auto h-[18px] w-auto" />
        <h1 className="mt-10 text-[30px] font-light leading-tight">Your clinic invited you to Daygo</h1>
        <p className="mt-3 text-[15px] text-white/65">Your clinic sees only what you choose to share, and you can stop sharing any time.</p>

        <div className="mt-8 rounded-[24px] border border-white/15 bg-white/[.05] p-6">
          <div className="text-[11px] uppercase tracking-[.18em] text-white/50">Your invite code</div>
          <div className="mt-2 font-mono text-[30px] font-semibold tracking-[.12em] text-[#E6E46C]">{code}</div>
        </div>

        <a href={`daygo://join?code=${encodeURIComponent(code)}`} className="mt-6 block rounded-full bg-[#E6E46C] py-3.5 text-[16px] font-semibold text-[#111518]">
          Open in Daygo
        </a>
        <a href={APP_STORE_URL} className="mt-3 block rounded-full border border-white/25 py-3.5 text-[16px]">
          Get Daygo on the App Store
        </a>

        <ol className="mt-8 space-y-2 text-left text-[14px] text-white/65">
          <li>1. Install Daygo and sign in.</li>
          <li>2. Come back here and tap <b className="text-white">Open in Daygo</b>, or go to Settings → My clinic and enter the code.</li>
          <li>3. Choose what to share. Done.</li>
        </ol>
      </div>
    </main>
  );
}
