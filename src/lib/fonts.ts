import localFont from "next/font/local";

/**
 * Self-hosted (Google Fonts, SIL OFL, latin subset) so builds never depend on
 * fetching fonts.googleapis.com.
 */

/** UI + brand accents — friendly rounded sans (Nunito, weights 600–800) */
export const brandSans = localFont({
  src: "../fonts/nunito-latin-600-800.woff2",
  weight: "600 800",
  style: "normal",
  variable: "--font-brand-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});

/** Hero titles — soft display serif (Fraunces, weights 600–700) */
export const heroSerif = localFont({
  src: "../fonts/fraunces-latin-600-700.woff2",
  weight: "600 700",
  style: "normal",
  variable: "--font-hero-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
