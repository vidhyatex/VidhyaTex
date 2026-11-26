"use client";

import { StorefrontImage } from "@/components/media/StorefrontImage";
import { ViewTransitionLink } from "@/components/ui/ViewTransitionLink";
import {
  formatShopByPriceTileLabel,
  type ShopByPriceBucket,
} from "@/lib/storefront/shop-by-price-buckets";
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

/** Fixed marketing portraits (brand art), reused in order for each real price tier. */
const SHOP_BY_PRICE_ARTWORK = [
  "/images/shop-by-price/fixed-01.jpg",
  "/images/shop-by-price/fixed-02.jpg",
  "/images/shop-by-price/fixed-03.jpg",
  "/images/shop-by-price/fixed-04.jpg",
] as const;

/** Need at least two real price tiers, otherwise "shop by price" is pointless. */
const MIN_PRICE_TIERS = 2;
const MAX_PRICE_TILES = 8;

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
  // Tiles come from real catalog prices (GST-inclusive); empty tiers never exist.
  if (buckets.length < MIN_PRICE_TIERS) return null;

  const tiles = buckets.slice(0, MAX_PRICE_TILES).map((bucket, index) => ({
    id: bucket.id,
    label: formatShopByPriceTileLabel(bucket.min, bucket.max),
    href: bucket.href,
    imageSrc: SHOP_BY_PRICE_ARTWORK[index % SHOP_BY_PRICE_ARTWORK.length],
    imageAlt: `Sarees priced ${bucket.label}`,
  }));

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
        {tiles.map((tile, index) => (
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
