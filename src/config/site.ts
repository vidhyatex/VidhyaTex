import type { NavItemWithOptionalChildren } from "@/types";

export type SiteConfig = typeof siteConfig;

/** Vidhya Tex storefront */
const ADDRESS_LINES = [
  "KK Nagar, Elampillai",
  "Salem",
  "Tamil Nadu",
  "India",
] as const;

const PHONE = "+91 99420 87560";
const PHONE_HREF = "tel:+919942087560";

const CONTACTS: readonly {
  name: string;
  phone: string;
  phoneHref: string;
}[] = [{ name: "Vidhya Tex", phone: PHONE, phoneHref: PHONE_HREF }];
const EMAIL = "vidhyatex7@gmail.com";
const GSTIN = "";

const SOCIAL = {
  instagram: "",
  youtube: "",
  facebook: "",
  whatsapp: "https://wa.me/919942087560",
} as const;

export const siteConfig = {
  shopBoardName: "Vidhya Tex",
  name: "Vidhya Tex",
  shortName: "Vidhya Tex",
  tagline: "Boutique online shopping",
  location: "Elampillai, Salem",
  description:
    "Vidhya Tex — boutique online shopping for sarees from Elampillai, Salem. Silk, cotton and designer sarees delivered across India.",
  searchPlaceholder: "Search sarees…",
  url: "https://vidhyatex.vercel.app",
  addressLines: ADDRESS_LINES,
  address: ADDRESS_LINES.join(", "),
  phone: PHONE,
  phoneHref: PHONE_HREF,
  contacts: CONTACTS,
  email: EMAIL,
  gstin: GSTIN,
  currency: "INR",
  currencySymbol: "₹",
  social: SOCIAL,
  announcements: [
    {
      text: "Welcome to Vidhya Tex — boutique online shopping",
      href: "/shop",
      cta: "Shop now",
    },
    {
      text: "Elampillai sarees · silk · cotton · designer",
      href: "/collections",
      cta: "Explore",
    },
    {
      text: "Order on WhatsApp: +91 99420 87560",
      href: "https://wa.me/919942087560",
      cta: "Chat now",
    },
    {
      text: "New arrivals & festive favourites — shop the collection",
      href: "/featured",
      cta: "Featured",
    },
  ],
  mainNav: [
    {
      title: "Collections",
      href: "/collections",
      description: "Browse collections.",
      items: [],
    },
    {
      title: "Featured",
      href: "/featured",
      description: "Featured products.",
      items: [],
    },
    {
      title: "Orders",
      href: "/orders",
      description: "Your orders.",
      items: [],
    },
  ] satisfies NavItemWithOptionalChildren[],

  footerNav: [
    {
      title: "Shop",
      items: [
        { title: "All products", href: "/shop", items: [] },
        { title: "Featured", href: "/featured", items: [] },
        { title: "All categories", href: "/collections", items: [] },
        { title: "Wishlist", href: "/wish-list", items: [] },
        { title: "Cart", href: "/cart", items: [] },
      ],
    },
    {
      title: "Explore",
      items: [
        { title: "Collections", href: "/collections", items: [] },
        { title: "Featured picks", href: "/featured", items: [] },
        { title: "Our story", href: "/about", items: [] },
        { title: "Contact", href: "/contact", items: [] },
      ],
    },
    {
      title: "Customer Service",
      items: [
        {
          title: "Terms & Conditions",
          href: "/terms-and-conditions",
          items: [],
        },
        { title: "Terms of Use", href: "/terms-of-use", items: [] },
        { title: "Privacy Policy", href: "/privacy-policy", items: [] },
        { title: "Shipping & Returns", href: "/shipping-returns", items: [] },
        { title: "Payment Methods", href: "/payment-methods", items: [] },
        { title: "FAQ", href: "/faq", items: [] },
        { title: "My orders", href: "/orders", items: [] },
      ],
    },
    {
      title: "About Vidhya Tex",
      items: [
        { title: "Our Story", href: "/about", items: [] },
        { title: "Our Collections", href: "/collections", items: [] },
        { title: "Contact", href: "/contact", items: [] },
      ],
    },
  ] satisfies NavItemWithOptionalChildren[],
};
