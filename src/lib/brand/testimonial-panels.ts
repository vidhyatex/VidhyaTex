/**
 * Logo-derived tones for customer testimonial panels (black · espresso · gold family).
 * Tones are dark enough that white text stays readable.
 */
export const testimonialPanels = [
  {
    id: "black",
    /** Logo centre disc */
    bg: "#1c1814",
    shadow: "rgba(28, 24, 20, 0.45)",
  },
  {
    id: "bronze",
    /** Deep gold */
    bg: "#8a6a1f",
    shadow: "rgba(138, 106, 31, 0.45)",
  },
  {
    id: "espresso",
    /** Wordmark text colour */
    bg: "#3a2c1f",
    shadow: "rgba(58, 44, 31, 0.45)",
  },
  {
    id: "amber",
    /** Antique gold */
    bg: "#9c6f0e",
    shadow: "rgba(156, 111, 14, 0.45)",
  },
  {
    id: "charcoal",
    bg: "#3a3128",
    shadow: "rgba(58, 49, 40, 0.45)",
  },
  {
    id: "gold",
    /** Ganesha line-art gold, darkened for contrast */
    bg: "#7a5f14",
    shadow: "rgba(122, 95, 20, 0.45)",
  },
] as const;

export type TestimonialPanel = (typeof testimonialPanels)[number];

export function testimonialPanelAt(index: number): TestimonialPanel {
  return testimonialPanels[index % testimonialPanels.length]!;
}
