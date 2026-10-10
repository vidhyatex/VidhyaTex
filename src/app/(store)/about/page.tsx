import InfoPage from "@/components/layouts/InfoPage";
import Link from "next/link";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Our Story | ${siteConfig.name}`,
  description: `About ${siteConfig.name} — boutique online saree shopping from Elampillai, Salem.`,
};

export default function AboutPage() {
  return (
    <InfoPage
      heading="Our Story"
      description={`${siteConfig.name} — ${siteConfig.tagline}.`}
    >
      <p>
        {siteConfig.name} is a saree boutique from Elampillai, Salem — a town
        known for its weaving. We bring you handpicked silk, cotton, fancy and
        designer sarees, delivered across India.
      </p>
      <p>
        Based in KK Nagar, Elampillai, Salem. For orders and enquiries, call or
        WhatsApp{" "}
        <a href={siteConfig.phoneHref} className="text-primary hover:underline">
          {siteConfig.phone}
        </a>
        {siteConfig.email ? (
          <>
            {" "}or email{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-primary hover:underline"
            >
              {siteConfig.email}
            </a>
          </>
        ) : null}
        .
      </p>
      <p>
        Browse our{" "}
        <Link href="/collections" className="text-primary hover:underline">
          collections
        </Link>
        , explore{" "}
        <Link href="/featured" className="text-primary hover:underline">
          featured products
        </Link>
        , or{" "}
        <Link href="/contact" className="text-primary hover:underline">
          get in touch
        </Link>{" "}
        for orders and enquiries.
      </p>
    </InfoPage>
  );
}
