import type { MetadataRoute } from "next";

// Open to search and AI crawlers; internal pages stay out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/redesign"] }],
    sitemap: "https://daygo.ai/sitemap.xml",
    host: "https://daygo.ai",
  };
}
