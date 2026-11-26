import Link from "next/link";

const LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Terms of Use", href: "/terms-and-conditions#terms-of-use" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Shipping & Delivery", href: "/shipping-delivery" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "Refund & Cancellation", href: "/refund-cancellation" },
  { label: "Payment Methods", href: "/payment-methods" },
] as const;

export function LegalFooterLinks({ className = "" }: { className?: string }) {
  return (
    <nav
      aria-label="Legal policies"
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-[#CFC3A7] ${className}`}
    >
      {LEGAL_LINKS.map((link, index) => (
        <span key={link.href} className="inline-flex items-center gap-3">
          {index > 0 ? (
            <span aria-hidden="true" className="text-[#C9A227]/50">
              |
            </span>
          ) : null}
          <Link
            href={link.href}
            className="font-medium text-[#F6EBCB] transition-colors hover:text-[#F5C518] hover:underline"
          >
            {link.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}

export default LegalFooterLinks;
