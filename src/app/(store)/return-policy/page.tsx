import InfoPage from "@/components/layouts/InfoPage";
import { resolveStorefrontContact } from "@/lib/integrations/settings";
import { ORDER_RETURNS, ORDER_SHIPPING } from "@/lib/storefront/order-shipping";
import { shopMailtoHref } from "@/lib/contact/links";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Return Policy | Vidhya Tex",
  description:
    "Return and replacement rules for Vidhya Tex sarees, including the 7-day window and unboxing video requirement.",
  alternates: {
    canonical: "/return-policy",
  },
};

export default async function ReturnPolicyPage() {
  const contact = await resolveStorefrontContact();
  const mailHref = shopMailtoHref(contact.email);

  return (
    <InfoPage
      heading="Return Policy"
      description="When and how you can return or replace a Vidhya Tex order."
    >
      <p className="text-xs text-muted-foreground">Last updated: 12 November 2026</p>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          1. Return window
        </h2>
        <p>{ORDER_RETURNS.summary}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          2. Return &amp; replacement rules
        </h2>
        <ul className="list-disc space-y-1.5 pl-5">
          {ORDER_RETURNS.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          3. After we approve a return
        </h2>
        <p>
          Once a return or replacement is approved, refund timing and payment
          method rules are in our{" "}
          <Link
            href={ORDER_RETURNS.refundPolicyHref}
            className="text-primary hover:underline"
          >
            Refund and Cancellation Policy
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
          Email us with your order ID before sending any item back
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
