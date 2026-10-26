import type { MetadataRoute } from "next";
import { markers } from "@/lib/markers";

const BASE = "https://daygo.ai";

// Every public page, including one per lab marker, for search engines.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/labs`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...markers.map((m) => ({
      url: `${BASE}/labs/${m.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${BASE}/support`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
