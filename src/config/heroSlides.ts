import { siteConfig } from "@/config/site";
import { BRAND_LOGO } from "@/lib/brand/logo";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
};

/** Homepage hero fallback until Admin → Home Banner uploads saree photos. */
export const heroSlides: HeroSlide[] = [
  {
    id: "sarees",
    title: "Elampillai sarees",
    subtitle: "Handpicked silk, cotton and fancy sarees from Salem",
    href: "/shop",
    cta: "Shop now",
    image: BRAND_LOGO.src,
    imageAlt: `${siteConfig.name} — Elampillai sarees`,
  },
  {
    id: "festive",
    title: "Festive & wedding collection",
    subtitle: "Rich silks and designer sarees for every occasion",
    href: "/collections",
    cta: "Explore",
    image: BRAND_LOGO.src,
    imageAlt: `${siteConfig.name} — festive and wedding sarees`,
  },
  {
    id: "daily",
    title: "Everyday comfort",
    subtitle: "Soft cotton and daily-wear sarees at boutique prices",
    href: "/shop",
    cta: "Browse all",
    image: BRAND_LOGO.src,
    imageAlt: `${siteConfig.name} — daily wear sarees`,
  },
];
