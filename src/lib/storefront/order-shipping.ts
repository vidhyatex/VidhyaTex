/** Shared order / shipping copy — short, plain words every buyer can follow. */

export const ORDER_SHIPPING = {
  title: "Order & shipping",
  /** Sidebar + page: main timings */
  processingLabel: "Processing time",
  processing: "2–3 days",
  processingNote: "Large orders may take a little longer.",
  deliveryLabel: "Delivery",
  regions: [
    {
      place: "Tamil Nadu",
      placeShort: "Tamil Nadu",
      time: "2–3 working days",
    },
    {
      place: "Other states in India",
      placeShort: "Other India",
      time: "5–6 working days",
    },
  ] as const,
  readyStock: "In-stock items usually ship sooner after we confirm.",
  tracking: "When we ship, you get an email with tracking.",
  contactPrompt: "No email in 10–15 working days? Contact us:",
  wholesale: "Wholesale: timing depends on order size.",
  fullDetailsHref: "/shipping-delivery",
  fullDetailsLabel: "Full details",
  contactWhatsApp: "WhatsApp",
  contactEmail: "Email",
} as const;

export const ORDER_SHIPPING_FALLBACK = {
  email: "",
} as const;

/** Shared returns / refund / cancellation copy — keep every storefront surface in sync. */
export const ORDER_RETURNS = {
  windowDays: 7,
  summary:
    "Returns or exchanges may be accepted within 7 days of delivery for unused items with original packaging intact.",
  /** Short blurb for PDP accordion / trust strip */
  short:
    "Eligible unused items within 7 days. For replacement of damaged or wrong items, share a full unboxing video.",
  faqAnswer:
    "Unused items in original condition may be returned within 7 days. For a replacement (damage or wrong item), you must share a full unboxing video. Read our Return Policy and email us before sending anything back.",
  trustTitle: "Easy Replacement",
  trustDescription:
    "Share an unboxing video for damage or wrong-item replacements.",
  rules: [
    "Please email us before sending any item back.",
    "For replacement of a damaged, defective, or wrong item, you must share a clear unboxing video showing the sealed package being opened through to the product.",
    "Claims without a complete unboxing video may not be eligible for replacement.",
    "Sarees that are used, washed, altered or have tags removed cannot be returned.",
    "Shipping charges for returns may apply unless the item is faulty and approved for replacement.",
  ] as const,
  cancellation: [
    "You may request cancellation before the order is shipped by emailing us with your order ID.",
    "Once the order is shipped, cancellation is not available; you may request a return under our Return Policy (if eligible).",
    "If we cancel an order due to stock issues, pricing errors, or suspected fraud, any amount collected is refunded to the original payment method.",
  ] as const,
  refunds: [
    "Approved refunds are processed to the original payment method (UPI, card, net banking, or wallet used at checkout).",
    "After we approve a return or cancellation, refunds are typically initiated within 5–7 working days.",
    "Your bank or payment provider may take additional time to credit the amount.",
    "Courier charges are refunded only when the return is due to our error (wrong, damaged, or defective item) and approved by us.",
  ] as const,
  /** Primary page for return / replacement rules */
  fullDetailsHref: "/return-policy",
  refundPolicyHref: "/refund-cancellation",
  shippingPolicyHref: "/shipping-delivery",
} as const;
