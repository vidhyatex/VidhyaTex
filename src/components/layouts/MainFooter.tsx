"use client";

import Link from "next/link";
import Branding from "./Branding";
import LegalFooterLinks from "./LegalFooterLinks";
import SareeBorder from "./SareeBorder";
import { siteConfig } from "@/config/site";
import SocialMedias from "./SocialMedias";
import { useStorefrontContact } from "@/providers/ShopContactProvider";

/**
 * Footer palette (espresso + zari gold + cream) — same family as the site's
 * brand tokens, tuned for a dark background.
 *   bg      #1C1814  espresso (brand primary)
 *   text    #F6EBCB  cream            muted  #CFC3A7  warm grey-cream
 *   gold    #F5C518  brand yellow     rule   #C9A227  zari gold
 */
const FOOTER_HEADING_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F5C518]";
const FOOTER_LINK_CLASS =
  "text-[#CFC3A7] transition-colors hover:text-[#F5C518] hover:underline";

function FooterLinkColumn({
  title,
  items,
}: {
  title: string;
  items: { title: string; href?: string }[];
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-[#F5C518]">{title}</p>
      <ul className="flex flex-col gap-y-2">
        {items.map((item) => {
          const href = item.href || "#";
          const isExternal =
            href.startsWith("http") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:");

          return (
            <li key={item.title}>
              <Link
                href={href}
                className={`text-sm ${FOOTER_LINK_CLASS}`}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MainFooter() {
  const { footerNav } = siteConfig;
  const contact = useStorefrontContact();

  return (
    <footer className="mt-[80px] bg-[#1C1814] text-[#F6EBCB] md:mt-[120px]">
      <SareeBorder />
      <div className="container pb-8 pt-8 md:pb-10 md:pt-10">
        <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-4 md:gap-x-8 lg:max-w-5xl">
          {footerNav.map((column) => (
            <FooterLinkColumn
              key={column.title}
              title={column.title ?? ""}
              items={column.items ?? []}
            />
          ))}
        </div>

        <div className="border-t border-[#C9A227]/30 pt-8 md:pt-10">
          <div className="grid gap-8 md:grid-cols-[minmax(min-content,360px)_1fr_auto] md:items-start md:gap-10 lg:gap-14">
            <div className="flex min-w-0 items-center overflow-visible">
              {/* Logo artwork is dark-on-light, so it sits on a cream plaque. */}
              <div className="inline-flex max-w-full rounded-xl bg-[#FFF8E1] px-3 py-2 shadow-[0_0_0_1px_rgba(201,162,39,0.6)]">
                <Branding size="footer" className="max-w-none" />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 md:max-w-xl">
              <div>
                <h3 className={`mb-2.5 ${FOOTER_HEADING_CLASS}`}>
                  Store address
                </h3>
                <address className="space-y-0.5 not-italic text-sm leading-relaxed text-[#CFC3A7]">
                  {contact.addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {contact.gstin ? (
                    <p className="pt-2">
                      <span className="font-medium text-[#F6EBCB]">
                        GSTIN:{" "}
                      </span>
                      {contact.gstin}
                    </p>
                  ) : null}
                  {contact.email ? (
                    <p>
                      <Link
                        href={`mailto:${contact.email}`}
                        className={`break-all ${FOOTER_LINK_CLASS}`}
                      >
                        {contact.email}
                      </Link>
                    </p>
                  ) : null}
                </address>
              </div>

              <div>
                <h3 className={`mb-2.5 ${FOOTER_HEADING_CLASS}`}>Contact</h3>
                <ul className="space-y-2 text-sm text-[#CFC3A7]">
                  {contact.email ? (
                    <li className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                      <span className="shrink-0 font-medium text-[#F6EBCB] sm:w-20">
                        Email
                      </span>
                      <Link
                        href={`mailto:${contact.email}`}
                        className={`break-all ${FOOTER_LINK_CLASS}`}
                      >
                        {contact.email}
                      </Link>
                    </li>
                  ) : null}
                  <li className="pt-1">
                    <Link
                      href="/contact"
                      className="font-medium text-[#F5C518] hover:underline"
                    >
                      View contact page →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <h3 className={FOOTER_HEADING_CLASS}>Follow us</h3>
              <SocialMedias
                containerClassName="gap-x-3 md:justify-end"
                itemsClassName="text-[#1C1814] hover:text-[#1C1814]"
                linkClassName="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8E1] p-0 ring-1 ring-[#C9A227]/60 focus-visible:ring-[#F5C518]"
              />
            </div>
          </div>

          <LegalFooterLinks className="mb-4 mt-8" />
          <p
            className="border-t border-[#C9A227]/30 pt-6 text-center text-xs text-[#CFC3A7]"
            suppressHydrationWarning
          >
            © {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;
