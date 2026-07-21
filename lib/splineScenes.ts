/**
 * Spline scene URLs used across the landing page. Paste your own
 * exported `.splinecode` URLs here — get them from spline.design:
 *   File → Export → Code Export → copy the URL ending in `.splinecode`
 *
 * Leave any of these as `""` to fall back to the CSS `IridescentBlob`
 * for that slot. Useful while you're picking scenes.
 *
 * Tips on picking scenes from spline.design/community:
 *   - Search for "iridescent", "blob", "glass orb", "liquid sphere"
 *   - Pick scenes with transparent backgrounds — they composite onto
 *     our pure-black layout cleanest
 *   - Smaller / simpler scenes load faster; the hero scene is what the
 *     user sees first, so prioritize lightness there
 */
export const SPLINE_SCENES = {
  /** Hero — appears top-right, ~520x520. The "object" the type leans on. */
  hero: "",

  /** Pricing section — centered behind the price card, ~460x460. */
  pricing: "",

  /** Final CTA — right side, ~260x260. Smaller / can be a different scene. */
  finalCTA: "",
};
