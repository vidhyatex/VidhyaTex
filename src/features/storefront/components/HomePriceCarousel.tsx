"use client";

import { StorefrontImage } from "@/components/media/StorefrontImage";
import { ViewTransitionLink } from "@/components/ui/ViewTransitionLink";
import type { ShopByPriceBucket } from "@/lib/storefront/shop-by-price-buckets";
import { HomeSectionHeader } from "./HomeSectionHeader";
import {
  HomeScrollSnapStrip,
  ScrollSnapItem,
  scrollSnapPriceItemClass,
} from "./HomeScrollSnapStrip";
import {
  MotionHoverLift,
  MotionRevealItem,
  MotionSection,
} from "./MotionSection";
import { ScallopedArchShapeDefs } from "./ScallopedArchShapeDefs";

type Props = {
  buckets: ShopByPriceBucket[];
};

/**
 * Fixed marketing portraits + reference-style price labels.
 * Stable like brand logo art — not catalog product photos.
 */
const SHOP_BY_PRICE_SHOWCASE = [
  {
    id: "below-500",
    label: "Below 500",
    href: "/shop?price_range=1-499&sort=PRICE_LOW_TO_HIGH",
    imageSrc: "/images/shop-by-price/fixed-01.jpg",
    imageAlt: "Sarees below ₹500",
  },
  {
    id: "500-1k",
    label: "500 - 1K",
    href: "/shop?price_range=500-999&sort=PRICE_LOW_TO_HIGH",
    imageSrc: "/images/shop-by-price/fixed-02.jpg",
    imageAlt: "Sarees from ₹500 to ₹1,000",
  },
  {
    id: "below-2k",
    label: "Below 2K",
    href: "/shop?price_range=1-1999&sort=PRICE_LOW_TO_HIGH",
    imageSrc: "/images/shop-by-price/fixed-03.jpg",
    imageAlt: "Sarees below ₹2,000",
  },
  {
    id: "bridal",
    label: "Bridal",
    href: "/shop?price_range=3000-7000&sort=PRICE_LOW_TO_HIGH",
    imageSrc: "/images/shop-by-price/fixed-04.jpg",
    imageAlt: "Bridal saree collection",
  },
] as const;

function PriceBucketCard({
  href,
  label,
  imageSrc,
  imageAlt,
}: {
  href: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <ViewTransitionLink
      href={href}
      className="group flex w-full flex-col items-center"
    >
      <div className="shop-by-card">
        <div className="shop-by-photo">
          <StorefrontImage
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 42vw, 180px"
            optimizeWidth={400}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="shop-by-photo-fade" aria-hidden />
        </div>

        <div className="shop-by-pill">
          <p className="shop-by-pill-label">{label}</p>
        </div>
      </div>
    </ViewTransitionLink>
  );
}

export function HomePriceCarousel({ buckets }: Props) {
  // Showcase always matches reference (4 fixed tiles). Buckets only gate the section.
  if (!buckets.length) return null;

  return (
    <MotionSection className="w-full min-w-0 py-4 sm:py-8 md:py-10">
      <ScallopedArchShapeDefs />
      <HomeSectionHeader
        title="Shop by"
        titleAccent="Price"
        href="/shop?sort=PRICE_LOW_TO_HIGH"
        viewMoreLabel="Browse all"
      />
      <HomeScrollSnapStrip ariaLabel="Shop by price ranges">
        {SHOP_BY_PRICE_SHOWCASE.map((tile, index) => (
          <ScrollSnapItem key={tile.id} className={scrollSnapPriceItemClass}>
            <MotionRevealItem index={index} instant className="w-full">
              <MotionHoverLift className="w-full">
                <PriceBucketCard
                  href={tile.href}
                  label={tile.label}
                  imageSrc={tile.imageSrc}
                  imageAlt={tile.imageAlt}
                />
              </MotionHoverLift>
            </MotionRevealItem>
          </ScrollSnapItem>
        ))}
      </HomeScrollSnapStrip>
    </MotionSection>
  );
}
