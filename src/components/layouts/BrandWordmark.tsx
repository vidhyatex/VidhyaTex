import Image from "next/image";
import { siteConfig } from "@/config/site";
import {
  BRAND_MARK,
  BRAND_WORDMARK,
  brandLogoMaxHeight,
} from "@/lib/brand/logo";
import { cn } from "@/lib/utils";
import type { ShopBoardBrandSize } from "@/lib/brand/shop-board";

export type BrandWordmarkSize = ShopBoardBrandSize;

type Props = {
  className?: string;
  size?: BrandWordmarkSize;
  align?: "left" | "center";
};

const sizeClass: Record<BrandWordmarkSize, string> = {
  nav: "text-[1.5rem] leading-none md:text-[1.7rem]",
  md: "text-[2rem] leading-none",
  footer: "text-[2.4rem] leading-none",
};

/** Vidhya Tex lockup — Ganesha badge mark plus serif wordmark. */
export function BrandWordmark({
  className,
  size = "md",
  align = "left",
}: Props) {
  const height = brandLogoMaxHeight[size];

  return (
    <span
      className={cn(
        "brand-board-lockup brand-wordmark inline-flex shrink-0 items-center gap-2",
        size === "nav" && "brand-board-lockup--nav",
        align === "center" && "mx-auto justify-center",
        className,
      )}
      style={{ minHeight: height }}
      aria-label={`${siteConfig.shopBoardName} — ${siteConfig.tagline}`}
    >
      <Image
        src={BRAND_MARK.src}
        alt=""
        width={height}
        height={height}
        priority={size === "nav"}
        className="relative z-[2] shrink-0 select-none"
        style={{ width: height, height }}
      />
      <span
        className={cn(
          "brand-wordmark-text relative z-[2] select-none whitespace-nowrap font-serif font-semibold tracking-wide",
          sizeClass[size],
        )}
      >
        {BRAND_WORDMARK}
      </span>
    </span>
  );
}

export default BrandWordmark;
