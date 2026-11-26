import { cn } from "@/lib/utils";

const GOLD = "#C9A227";

/**
 * One repeat of a woven-saree (zari) border: double gold rules top and bottom,
 * with a lotus alternating with a diamond-and-dot between them.
 * Tile is 40×24 and repeats seamlessly on the x axis (dots sit on the seam).
 */
const BORDER_TILE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 40 24" fill="none" stroke="${GOLD}">
<path d="M0 1.5H40M0 22.5H40" stroke-width="1.6"/>
<path d="M0 4H40M0 20H40" stroke-width=".6"/>
<g stroke-width=".9" stroke-linejoin="round">
<path d="M10 6.2C13 9.2 13 13.2 10 17.2C7 13.2 7 9.2 10 6.2Z" fill="${GOLD}" fill-opacity=".35"/>
<path d="M10 17.2C6 15.4 3.6 12 4 8.8C7 9.8 9 12.2 10 17.2Z"/>
<path d="M10 17.2C14 15.4 16.4 12 16 8.8C13 9.8 11 12.2 10 17.2Z"/>
<path d="M30 6.5L35.5 12L30 17.5L24.5 12Z"/>
<path d="M30 9.5L32.5 12L30 14.5L27.5 12Z" fill="${GOLD}"/>
</g>
<g fill="${GOLD}" stroke="none">
<circle cx="20" cy="12" r="1"/>
<circle cx="0" cy="12" r="1"/>
<circle cx="40" cy="12" r="1"/>
<circle cx="10" cy="18.6" r=".7"/>
</g>
</svg>`;

const BORDER_BACKGROUND = `url("data:image/svg+xml,${encodeURIComponent(BORDER_TILE_SVG)}")`;

type Props = {
  className?: string;
};

/** Decorative saree-style border strip. Pure CSS/SVG — no image request. */
export function SareeBorder({ className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-7 w-full bg-[#1C1814] md:h-8", className)}
      style={{
        backgroundImage: BORDER_BACKGROUND,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
        backgroundPosition: "center top",
      }}
    />
  );
}

export default SareeBorder;
