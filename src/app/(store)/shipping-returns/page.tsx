import { permanentRedirect } from "next/navigation";

/** Legacy URL — shipping content now lives at /shipping-delivery. */
export default function ShippingReturnsRedirectPage() {
  permanentRedirect("/shipping-delivery");
}
