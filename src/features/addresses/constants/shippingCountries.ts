/** ISO-3166 alpha-2 options for checkout (India first). */
export const SHIPPING_COUNTRIES = [
  { code: "IN", name: "India" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "OM", name: "Oman" },
  { code: "BH", name: "Bahrain" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "IE", name: "Ireland" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "ES", name: "Spain" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
] as const;

/** Sentinel for the address form UI when the shopper enters a custom ISO code. */
export const OTHER_COUNTRY_OPTION = "__other";

export type ShippingCountryCode =
  (typeof SHIPPING_COUNTRIES)[number]["code"];

export function shippingCountryName(code: string): string {
  const normalized = code.trim().toUpperCase();
  const match = SHIPPING_COUNTRIES.find((item) => item.code === normalized);
  return match?.name ?? normalized;
}
