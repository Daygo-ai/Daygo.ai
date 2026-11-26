"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { basePath, langFromPath, localePath } from "@/lib/i18n";

/** EN | LT switch that keeps you on the same page. */
export function LangToggle({ light = false }: { light?: boolean }) {
  const path = usePathname() ?? "/";
  const lang = langFromPath(path);
  const base = basePath(path);
  const on = light ? "text-black" : "text-white";
  const off = light ? "text-black/40 hover:text-black" : "text-white/45 hover:text-white";
  return (
    <div className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wider" aria-label="Language">
      <Link href={localePath("en", base)} hrefLang="en" className={`transition ${lang === "en" ? on : off}`} aria-current={lang === "en" ? "true" : undefined}>
        EN
      </Link>
      <span className={light ? "text-black/25" : "text-white/30"}>/</span>
      <Link href={localePath("lt", base)} hrefLang="lt" className={`transition ${lang === "lt" ? on : off}`} aria-current={lang === "lt" ? "true" : undefined}>
        LT
      </Link>
    </div>
  );
}

/** Sets <html lang> on Lithuanian pages (the root layout renders "en"). */
export function HtmlLang({ lang }: { lang: string }) {
  return <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang)}` }} />;
}
