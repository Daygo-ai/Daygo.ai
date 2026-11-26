// English lives at the normal paths; Lithuanian under /lt (daygo.ai/lt/clinics).
// Only the public marketing pages have a Lithuanian version; the clinic app
// (/clinic), lab marker pages (/labs) and admin stay English.

export type Lang = "en" | "lt";

/** Pages that exist in both languages. */
const LOCALIZED = ["/", "/clinics", "/faq", "/support", "/privacy", "/terms"];

export const langFromPath = (path: string | null | undefined): Lang =>
  path === "/lt" || path?.startsWith("/lt/") || path?.startsWith("/lt#") ? "lt" : "en";

/** The path without its /lt prefix. */
export const basePath = (path: string): string => {
  if (path === "/lt") return "/";
  if (path.startsWith("/lt/")) return path.slice(3);
  if (path.startsWith("/lt#")) return "/" + path.slice(3);
  return path;
};

/** A link to `path` in `lang`. Section links like "/#pricing" become "/lt#pricing". */
export function localePath(lang: Lang, path: string): string {
  if (lang === "en") return path;
  if (path.startsWith("/#")) return "/lt" + path.slice(1);
  const [p, hash = ""] = path.split("#");
  if (!LOCALIZED.includes(p)) return path;
  return (p === "/" ? "/lt" : `/lt${p}`) + (hash ? `#${hash}` : "");
}

/** Pick the string for a language: t(lang, { en: "...", lt: "..." }). */
export const t = <T,>(lang: Lang, v: { en: T; lt: T }): T => v[lang];
