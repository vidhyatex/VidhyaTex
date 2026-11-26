import { CACHE_TAGS } from "@/lib/cache/constants";
import { withStorefrontCache } from "@/lib/cache/storefront-cache";
import { loadCategorizedProductsForPricing } from "@/lib/storefront/categorized-products";
import { getStorefrontGstFactor } from "@/lib/storefront/gst-factor";
import {
  buildShopByPriceBuckets,
  type ShopByPriceBucket,
} from "./shop-by-price-buckets";

async function loadShopByPriceBuckets(): Promise<ShopByPriceBucket[]> {
  const [rows, gstFactor] = await Promise.all([
    loadCategorizedProductsForPricing(),
    getStorefrontGstFactor(),
  ]);
  return buildShopByPriceBuckets(rows, undefined, gstFactor);
}

export async function getShopByPriceBucketsCached(): Promise<
  ShopByPriceBucket[]
> {
  // v2: bucket ranges follow the GST-inclusive shown price (prefix still
  // matches "sf:shop-by-price" in cache invalidation).
  return withStorefrontCache("sf:shop-by-price:v2", loadShopByPriceBuckets, {
    revalidate: 300,
    tags: [CACHE_TAGS.products, CACHE_TAGS.drafts],
  });
}
