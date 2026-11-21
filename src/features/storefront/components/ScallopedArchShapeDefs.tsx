/**
 * Shared multi-lobed Indian-arch silhouette for Shop by Price + Testimonials.
 * Keep a single SVG id on the page (`storefront-scallop-arch`).
 */
export function ScallopedArchShapeDefs() {
  return (
    <svg
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      aria-hidden
    >
      <defs>
        <clipPath
          id="storefront-scallop-arch"
          clipPathUnits="objectBoundingBox"
        >
          <path d="M0.50 0.02 C0.56 0.02 0.61 0.035 0.65 0.06 C0.69 0.09 0.72 0.12 0.74 0.16 C0.78 0.22 0.80 0.28 0.82 0.34 C0.84 0.40 0.81 0.44 0.83 0.49 C0.85 0.55 0.88 0.60 0.90 0.66 C0.93 0.74 0.92 0.82 0.86 0.89 C0.80 0.95 0.68 0.99 0.50 0.99 C0.32 0.99 0.20 0.95 0.14 0.89 C0.08 0.82 0.07 0.74 0.10 0.66 C0.12 0.60 0.15 0.55 0.17 0.49 C0.19 0.44 0.16 0.40 0.18 0.34 C0.20 0.28 0.22 0.22 0.26 0.16 C0.28 0.12 0.31 0.09 0.35 0.06 C0.39 0.035 0.44 0.02 0.50 0.02 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
