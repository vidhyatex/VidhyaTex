import { getGstInclusiveFactor } from "@/lib/courier/calculate";
import { getStorefrontRuntimeBundleCached } from "@/lib/integrations/settings";

/**
 * Multiplier that turns a stored (GST-exclusive) price into the price shown on
 * the storefront. Falls back to 1 if settings cannot be loaded, so price
 * filtering never fails because of a settings outage.
 */
export async function getStorefrontGstFactor(): Promise<number> {
  try {
    const bundle = await getStorefrontRuntimeBundleCached();
    const factor = getGstInclusiveFactor(bundle.courierCharges);
    return Number.isFinite(factor) && factor > 0 ? factor : 1;
  } catch (error) {
    console.error("[gst-factor] falling back to 1:", error);
    return 1;
  }
}
