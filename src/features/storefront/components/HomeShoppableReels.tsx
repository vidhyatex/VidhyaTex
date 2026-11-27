"use client";

import { StorefrontImage } from "@/components/media/StorefrontImage";
import { ShoppingBag } from "lucide-react";
import { DocumentType } from "@/gql";
import { ViewTransitionLink } from "@/components/ui/ViewTransitionLink";
import { HomeFeaturedProductFragment } from "./HomeFeaturedCarousel";
import { HomeSectionHeader } from "./HomeSectionHeader";
import {
  HomeScrollSnapStrip,
  ScrollSnapItem,
  scrollSnapReelItemClass,
} from "./HomeScrollSnapStrip";
import { MotionRevealItem, MotionSection } from "./MotionSection";
import {
  ProductDiscountBadge,
  ProductPriceDisplay,
} from "@/features/products/components/ProductPriceDisplay";
import {
  productImageTransitionName,
  viewTransitionStyle,
} from "@/lib/view-transitions";
import { cn, keytoUrl } from "@/lib/utils";

type ProductNode = DocumentType<typeof HomeFeaturedProductFragment>;

type Props = {
  products: { node: ProductNode }[];
  packLabels?: Record<string, string | null>;
};

function ReelProductCard({
  product,
  packLabel,
}: {
  product: ProductNode;
  packLabel?: string | null;
}) {
  const { id, name, slug, featuredImage } = product;
  if (!featuredImage?.key) return null;

  const imageSrc = keytoUrl(featuredImage.key);

  return (
    <ViewTransitionLink href={`/shop/${slug}`} className="group block w-full">
      <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-brand-gold/40 bg-white shadow-[0_16px_40px_-20px_rgba(201,162,39,0.45)]">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          <StorefrontImage
            src={imageSrc}
            alt={featuredImage.alt || name}
            fill
            sizes="(max-width: 640px) 45vw, 220px"
            optimizeWidth={400}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
            style={viewTransitionStyle(productImageTransitionName(id))}
            loading="lazy"
          />
          <ProductDiscountBadge
            product={product}
            className="pointer-events-none absolute left-2 top-2 z-[1]"
          />
        </div>
        <div className="flex flex-col gap-1.5 p-3">
          <p className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-foreground">
            {name}
          </p>
          <ProductPriceDisplay
            product={product}
            layout="inline"
            className="craft-price-pill--card"
            saleClassName="font-extrabold"
          />
          {packLabel ? (
            <p className="text-xs font-medium text-muted-foreground">
              {packLabel}
            </p>
          ) : null}
          <span
            className={cn(
              "mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1C1814] px-4 text-sm font-bold text-[#F5C518] shadow-md",
              "transition-transform duration-300 group-hover:scale-[1.02] group-active:scale-[0.98]",
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            Shop now
          </span>
        </div>
      </article>
    </ViewTransitionLink>
  );
}

/** Featured product clips — separate from admin testimonials. */
export function HomeShoppableReels({ products, packLabels }: Props) {
  const items = products
    .map(({ node }) => node)
    .filter((node) => node.featuredImage?.key)
    .slice(0, 16);

  if (!items.length) return null;

  return (
    <MotionSection className="w-full min-w-0 py-4 sm:py-8 md:py-10">
      <HomeSectionHeader
        title="Watch &"
        titleAccent="Shop"
        href="/featured"
        viewMoreLabel="Shop featured"
      />
      <HomeScrollSnapStrip ariaLabel="Watch and shop featured crafts">
        {items.map((product, index) => (
          <ScrollSnapItem key={product.id} className={scrollSnapReelItemClass}>
            <MotionRevealItem index={index} instant className="w-full">
              <ReelProductCard
                product={product}
                packLabel={packLabels?.[product.id]}
              />
            </MotionRevealItem>
          </ScrollSnapItem>
        ))}
      </HomeScrollSnapStrip>
    </MotionSection>
  );
}
