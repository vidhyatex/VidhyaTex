import Header from "@/components/layouts/Header";
import ProductCard from "./ProductCard";
import {
  HomeScrollSnapStrip,
  ScrollSnapItem,
  scrollSnapRecommendationItemClass,
} from "@/features/storefront/components/HomeScrollSnapStrip";
import { getDraftProductIdsSafe } from "@/lib/storefront/draft-product-ids";
import { getRecommendationProductsCached } from "@/lib/storefront/recommendations";
import { getProductPackLabelsByIds } from "@/lib/products/pack.server";
import { getProductSizePreviewsByIds } from "@/lib/products/sizeConfig";
import { withFallback } from "@/lib/resilience";

type Props = {
  first?: number;
  className?: string;
};

export default async function RecommendationProductsSection({
  first = 4,
}: Props) {
  const [data, draftProductIds] = await Promise.all([
    withFallback(
      "recommendations",
      () => getRecommendationProductsCached(first),
      null,
    ),
    getDraftProductIdsSafe(),
  ]);

  // Recommendations are optional; hide the block rather than risk showing drafts.
  if (draftProductIds === null) return null;

  const draftIds = new Set(draftProductIds);
  const edges =
    data?.recommendations?.edges?.filter(
      (edge) => !draftIds.has(edge.node.id),
    ) ?? [];

  if (edges.length === 0) return null;

  const recommendationIds = edges.map(({ node }) => node.id);
  const [packLabels, sizePreviews] = await Promise.all([
    getProductPackLabelsByIds(recommendationIds),
    getProductSizePreviewsByIds(recommendationIds),
  ]);

  return (
    // min-w-0: this renders inside the Shell CSS grid; without it the strip
    // grows to the full width of all cards and cannot scroll.
    <Header
      heading={`We Think You'll Love`}
      className="min-w-0 pb-[30px] pt-[80px]"
    >
      <div className="container min-w-0">
        <HomeScrollSnapStrip
          ariaLabel="We think you'll love"
          className="-mx-12 px-4 sm:mx-0 sm:px-0"
          showArrows
        >
          {edges.map(({ node }) => (
            <ScrollSnapItem
              key={node.id}
              className={scrollSnapRecommendationItemClass}
            >
              <ProductCard
                product={node}
                packLabel={packLabels[node.id]}
                sizePreview={sizePreviews[node.id] ?? null}
              />
            </ScrollSnapItem>
          ))}
        </HomeScrollSnapStrip>
      </div>
    </Header>
  );
}
