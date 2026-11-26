"use client";

import { usePathname } from "next/navigation";
import { langFromPath, type Lang } from "@/lib/i18n";

/** The page language for client components, read from the URL (/lt/...). */
export function useLang(): Lang {
  return langFromPath(usePathname());
}
