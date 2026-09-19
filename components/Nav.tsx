import Link from "next/link";
import Image from "next/image";
import { APP_STORE_URL, NAV_LINKS } from "@/lib/brand";

/**
 * Flat black header shared by every page. Section links are absolute
 * (`/#pricing` rather than `#pricing`) so they still work from the legal,
 * support and labs pages, which have no such sections of their own.
 */
export function Nav() {
  return (
    <header className="flex items-center justify-between bg-black px-6 py-5 text-white md:px-10">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="" width={22} height={22} className="rounded-full" />
        <span className="text-lg font-black tracking-tight">DAYGO</span>
      </Link>

      <nav className="hidden items-center gap-9 text-[13px] text-white/75 md:flex">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="transition hover:text-white">
            {l.label}
          </Link>
        ))}
      </nav>

      <a
        href={APP_STORE_URL}
        className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black transition hover:bg-white/90"
      >
        <AppleMark className="h-4 w-4" />
        Download App
      </a>
    </header>
  );
}

function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
