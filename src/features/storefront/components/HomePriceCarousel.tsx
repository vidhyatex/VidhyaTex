"use client";

import { StorefrontImage } from "@/components/media/StorefrontImage";
import { ViewTransitionLink } from "@/components/ui/ViewTransitionLink";
import type { ShopByPriceBucket } from "@/lib/storefront/shop-by-price-buckets";
import { keytoUrl } from "@/lib/utils";
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

type Props = {
  buckets: ShopByPriceBucket[];
};

function PriceBucketCard({ bucket }: { bucket: ShopByPriceBucket }) {
  const imageSrc = bucket.imageKey ? keytoUrl(bucket.imageKey) : null;
  const productLabel =
    bucket.productCount === 1 ? "1 item" : `${bucket.productCount} items`;

  return (
    <ViewTransitionLink
      href={bucket.href}
      className="group flex w-full flex-col items-center gap-2.5 sm:gap-3"
    >
      <div className="shop-by-frame-wrap">
        <div className="shop-by-frame">
          {imageSrc ? (
            <StorefrontImage
              src={imageSrc}
              alt={bucket.imageAlt}
              fill
              sizes="(max-width: 640px) 46vw, 200px"
              optimizeWidth={400}
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-rose/25 via-brand-cream to-brand-gold/30" />
          )}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-x-2 bottom-3 z-[3] flex justify-center px-1 sm:inset-x-3 sm:bottom-4">
            <p className="craft-price-pill craft-price-pill--frost max-w-full justify-center truncate text-center text-xs sm:text-sm">
              {bucket.label}
            </p>
          </div>
        </div>
      </div>
      <p className="px-1 text-center text-xs font-medium text-muted-foreground sm:text-sm">
        {productLabel}
      </p>
    </ViewTransitionLink>
  );
}

export function HomePriceCarousel({ buckets }: Props) {
  if (!buckets.length) return null;

  return (
    <MotionSection className="w-full min-w-0 py-4 sm:py-8 md:py-10">
      <HomeSectionHeader
        title="Shop by"
        titleAccent="Price"
        href="/shop?sort=PRICE_LOW_TO_HIGH"
        viewMoreLabel="Browse all"
      />
      <HomeScrollSnapStrip ariaLabel="Shop by price ranges">
        {buckets.map((bucket, index) => (
          <ScrollSnapItem key={bucket.id} className={scrollSnapPriceItemClass}>
            <MotionRevealItem index={index} instant className="w-full">
              <MotionHoverLift className="w-full">
                <PriceBucketCard bucket={bucket} />
              </MotionHoverLift>
            </MotionRevealItem>
          </ScrollSnapItem>
        ))}
      </HomeScrollSnapStrip>
    </MotionSection>
  );
}
