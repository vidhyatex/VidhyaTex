import React from "react";
import Link from "next/link";
import { ORDER_RETURNS, ORDER_SHIPPING } from "@/lib/storefront/order-shipping";

type Props = {};

function ShipReturns({}: Props) {
  return (
    <div>
      Shipping &amp; returns. {ORDER_RETURNS.short} Learn more on our{" "}
      <Link href={ORDER_SHIPPING.fullDetailsHref} className="underline">
        Shipping and Delivery Policy
      </Link>
      ,{" "}
      <Link href={ORDER_RETURNS.fullDetailsHref} className="underline">
        Return Policy
      </Link>
      , and{" "}
      <Link href={ORDER_RETURNS.refundPolicyHref} className="underline">
        Refund and Cancellation Policy
      </Link>
      .
    </div>
  );
}

export default ShipReturns;
