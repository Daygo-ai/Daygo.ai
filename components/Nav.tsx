import Link from "next/link";
import Image from "next/image";
import { APP_STORE_URL, NAV_LINKS } from "@/lib/brand";
import { localePath, type Lang } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";

/**
 * Flat black header shared by every page. Section links are absolute
 * (`/#pricing` rather than `#pricing`) so they still work from the legal,
 * support and labs pages, which have no such sections of their own.
 */
export function Nav({ light = false, lang = "en" }: { light?: boolean; lang?: Lang }) {
  return (
    <header
      className={`relative flex items-center justify-between px-6 py-5 md:px-10 ${light ? "bg-[#F2F1EC] text-black" : "bg-black text-white"}`}
    >
      <Link href={localePath(lang, "/")} className="flex items-center gap-2">
        <Image
          src="/daygo-wordmark.webp"
          alt="Daygo"
          width={2000}
          height={302}
          priority
          className={`h-[18px] w-auto ${light ? "invert" : ""}`}
        />
      </Link>

      <nav className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-9 text-[13px] md:flex ${light ? "text-black/60" : "text-white/75"}`}>
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={localePath(lang, l.href)} className={`transition ${light ? "hover:text-black" : "hover:text-white"}`}>
            {lang === "lt" ? l.lt : l.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-5">
      <LangToggle light={light} />
      <a
        href={APP_STORE_URL}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition ${light ? "bg-black text-white hover:bg-black/85" : "bg-white text-black hover:bg-white/90"}`}
      >
        <AppleMark className="h-4 w-4" />
        {lang === "lt" ? "Atsisiųsti" : "Download App"}
      </a>
      </div>
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
