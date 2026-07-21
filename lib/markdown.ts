import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Reads a markdown file from `web/legal/`. Used by /privacy and /terms.
 *
 * These used to live one level above `web/` (shared with the iOS repo
 * on disk), but Vercel only deploys the `web/` subtree — anything
 * outside it doesn't exist at build time. Copied in here so the
 * deployed site is self-contained; keep `../legal/*.md` in sync by
 * hand when either doc changes.
 */
export async function readLegalMarkdown(name: "privacy-policy" | "terms"): Promise<string> {
  const filePath = path.resolve(process.cwd(), "legal", `${name}.md`);
  return fs.readFile(filePath, "utf-8");
}
