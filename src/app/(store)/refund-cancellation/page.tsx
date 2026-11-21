import InfoPage from "@/components/layouts/InfoPage";
import { resolveStorefrontContact } from "@/lib/integrations/settings";
import { ORDER_RETURNS, ORDER_SHIPPING } from "@/lib/storefront/order-shipping";
import { shopMailtoHref } from "@/lib/contact/links";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy | Vidhya Tex",
  description:
    "Order cancellation and refund timelines for Vidhya Tex purchases.",
  alternates: {
    canonical: "/refund-cancellation",
  },
};

export default async function RefundCancellationPage() {
  const contact = await resolveStorefrontContact();
  const mailHref = shopMailtoHref(contact.email);

  return (
    <InfoPage
      heading="Refund and Cancellation Policy"
      description="How order cancellations and refunds work for Vidhya Tex purchases."
    >
      <p className="text-xs text-muted-foreground">Last updated: 12 November 2026</p>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          1. Order cancellation
        </h2>
        <ul className="list-disc space-y-1.5 pl-5">
          {ORDER_RETURNS.cancellation.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">2. Refunds</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          {ORDER_RETURNS.refunds.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          3. Returns &amp; replacements
        </h2>
        <p>
          Eligibility, the 7-day window, and unboxing-video rules are in our{" "}
          <Link
            href={ORDER_RETURNS.fullDetailsHref}
            className="text-primary hover:underline"
          >
            Return Policy
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          4. Shipping &amp; delivery
        </h2>
        <p>
          Processing and delivery timelines are in our{" "}
          <Link
            href={ORDER_SHIPPING.fullDetailsHref}
            className="text-primary hover:underline"
          >
            Shipping and Delivery Policy
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">5. Contact</h2>
        <p>
          Email us with your order ID for cancellation or refund questions
          {mailHref ? (
            <>
              :{" "}
              <Link href={mailHref} className="text-primary hover:underline">
                {contact.email}
              </Link>
            </>
          ) : (
            "."
          )}
        </p>
      </section>
    </InfoPage>
  );
}
