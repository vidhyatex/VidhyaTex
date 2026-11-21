import { getLandingPageDataCached } from "@/lib/storefront/landing-data";

/** Published testimonials for /testimonials (reuses landing cache). */
export async function getPublishedTestimonialsCached() {
  const data = await getLandingPageDataCached();
  return data?.homeTestimonials?.edges ?? [];
}
