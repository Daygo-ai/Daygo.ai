import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Reads a markdown file from the repo's `legal/` directory (which sits
 * one level above `web/`). Used by /privacy and /terms so the website
 * and the app's bundled docs stay in sync — one source of truth.
 */
export async function readLegalMarkdown(name: "privacy-policy" | "terms"): Promise<string> {
  const filePath = path.resolve(process.cwd(), "..", "legal", `${name}.md`);
  return fs.readFile(filePath, "utf-8");
}
