/**
 * Vidhya Tex brand wordmark text (shown next to the badge mark in the header).
 */
export const BRAND_WORDMARK = "Vidhya Tex" as const;

/**
 * Full circular badge (Ganesha, "VIDHYA", "Boutique online shopping") for
 * JSON-LD, emails and social previews.
 */
export const BRAND_LOGO = {
  src: "/images/vidhyatex-logo.png",
  width: 512,
  height: 512,
} as const;

/** Compact Ganesha mark, readable at header / favicon sizes. */
export const BRAND_MARK = {
  src: "/images/vidhyatex-mark.png",
  width: 256,
  height: 256,
} as const;

/**
 * Fixed display heights (px) for the header lockup — keeps header metrics in sync.
 */
export const brandLogoMaxHeight = {
  nav: 40,
  md: 52,
  footer: 64,
} as const;

export type BrandLogoSize = keyof typeof brandLogoMaxHeight;
