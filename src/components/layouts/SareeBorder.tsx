import { cn } from "@/lib/utils";

const GOLD = "#C9A227";

/**
 * One repeat of the border motif (72×28): a mango/paisley (kalka) alternating
 * with a three-feather peacock fan, separated by small diamonds. The diamonds
 * at x=0 and x=72 are cut by the tile edge and join into whole diamonds when
 * the tile repeats, so the pattern is seamless.
 */
const MOTIF_TILE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="28" viewBox="0 6 72 28" fill="none" stroke="${GOLD}">
<g stroke-width=".9" stroke-linejoin="round" stroke-linecap="round">
<path d="M16 32C9 32 7 25 10.5 18.5C13.5 13 19 10 25 8.5C23.5 12.5 28 15 26.5 22C25.5 28 22 32 16 32Z" fill="${GOLD}" fill-opacity=".28"/>
<path d="M16.5 28.5C12 28.5 10.8 24 13 19.5C15 16 18.5 14 22 13C21.5 16 24 17.5 23 22C22.3 26 20.5 28.5 16.5 28.5Z"/>
<circle cx="17" cy="23" r="1.6" fill="${GOLD}" stroke="none"/>
<path d="M54 33V11"/>
<ellipse cx="54" cy="16.5" rx="4.4" ry="6.4" fill="${GOLD}" fill-opacity=".22"/>
<ellipse cx="54" cy="16.5" rx="2.5" ry="3.9" fill="${GOLD}" fill-opacity=".45"/>
<circle cx="54" cy="16" r="1.3" fill="${GOLD}" stroke="none"/>
<g transform="rotate(-32 54 33) translate(54 33) scale(.8) translate(-54 -33)">
<path d="M54 33V11"/>
<ellipse cx="54" cy="16.5" rx="4.4" ry="6.4" fill="${GOLD}" fill-opacity=".22"/>
<ellipse cx="54" cy="16.5" rx="2.5" ry="3.9" fill="${GOLD}" fill-opacity=".45"/>
<circle cx="54" cy="16" r="1.3" fill="${GOLD}" stroke="none"/>
</g>
<g transform="rotate(32 54 33) translate(54 33) scale(.8) translate(-54 -33)">
<path d="M54 33V11"/>
<ellipse cx="54" cy="16.5" rx="4.4" ry="6.4" fill="${GOLD}" fill-opacity=".22"/>
<ellipse cx="54" cy="16.5" rx="2.5" ry="3.9" fill="${GOLD}" fill-opacity=".45"/>
<circle cx="54" cy="16" r="1.3" fill="${GOLD}" stroke="none"/>
</g>
</g>
<g fill="${GOLD}" stroke="none">
<path d="M36 16L39 20L36 24L33 20Z"/>
<path d="M0 16L3 20L0 24L-3 20Z"/>
<path d="M72 16L75 20L72 24L69 20Z"/>
<circle cx="54" cy="35" r=".8"/>
<circle cx="16" cy="34.2" r=".7"/>
</g>
</svg>`;

const MOTIF = `url("data:image/svg+xml,${encodeURIComponent(MOTIF_TILE_SVG)}")`;
const RULE = `linear-gradient(${GOLD}, ${GOLD})`;

/**
 * Zari rules (thick + thin, top and bottom) are separate full-width layers,
 * not part of the tile, so they stay crisp and unbroken at any scale.
 */
const BORDER_STYLE = {
  backgroundImage: [MOTIF, RULE, RULE, RULE, RULE].join(","),
  backgroundRepeat: "repeat-x, no-repeat, no-repeat, no-repeat, no-repeat",
  backgroundSize:
    "auto calc(100% - 12px), 100% 2px, 100% 1px, 100% 2px, 100% 1px",
  backgroundPosition:
    "center center, left top, left 4px, left bottom, left calc(100% - 4px)",
} as const;

type Props = {
  className?: string;
};

/**
 * Decorative saree-style border strip (peacock + mango/paisley).
 * Pure CSS/SVG — no image request.
 */
export function SareeBorder({ className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-10 w-full bg-[#1C1814] md:h-12", className)}
      style={BORDER_STYLE}
    />
  );
}

export default SareeBorder;
