import InfoPage from "@/components/layouts/InfoPage";
import { resolveStorefrontContact } from "@/lib/integrations/settings";
import { ORDER_RETURNS, ORDER_SHIPPING } from "@/lib/storefront/order-shipping";
import { shopMailtoHref } from "@/lib/contact/links";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy | Vidhya Tex",
  description:
    "Order processing, delivery timelines, and tracking for Vidhya Tex — Tamil Nadu, India, and wholesale.",
  alternates: {
    canonical: "/shipping-delivery",
  },
};

export default async function ShippingDeliveryPage() {
  const contact = await resolveStorefrontContact();
  const mailHref = shopMailtoHref(contact.email);

  return (
    <InfoPage
      heading="Shipping and Delivery Policy"
      description="How long orders take to process and deliver — so every buyer knows what to expect."
    >
      <p className="text-xs text-muted-foreground">Last updated: 12 November 2026</p>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          {ORDER_SHIPPING.processingLabel}
        </h2>
        <p>
          We need <strong>{ORDER_SHIPPING.processing}</strong> to prepare your
          order. {ORDER_SHIPPING.processingNote}
        </p>
        <p>{ORDER_SHIPPING.readyStock}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          {ORDER_SHIPPING.deliveryLabel}
        </h2>
        <ul className="list-disc space-y-1.5 pl-5">
          {ORDER_SHIPPING.regions.map((row) => (
            <li key={row.place}>
              <strong>{row.place}:</strong> {row.time}
            </li>
          ))}
        </ul>
        <p>
          Delivery times are estimates for working days after dispatch and may
          vary with courier capacity, festivals, weather, or remote locations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Tracking your order
        </h2>
        <p>{ORDER_SHIPPING.tracking}</p>
        {mailHref ? (
          <>
            <p>{ORDER_SHIPPING.contactPrompt}</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Email:{" "}
                <Link href={mailHref} className="text-primary hover:underline">
                  {contact.email}
                </Link>
              </li>
            </ul>
          </>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Wholesale orders
        </h2>
        <p>{ORDER_SHIPPING.wholesale}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Returns, refunds &amp; cancellations
        </h2>
        <p>
          See our{" "}
          <Link
            href={ORDER_RETURNS.fullDetailsHref}
            className="text-primary hover:underline"
          >
            Return Policy
          </Link>{" "}
          and{" "}
          <Link
            href={ORDER_RETURNS.refundPolicyHref}
            className="text-primary hover:underline"
          >
            Refund and Cancellation Policy
          </Link>
          .
        </p>
      </section>
    </InfoPage>
  );
}
