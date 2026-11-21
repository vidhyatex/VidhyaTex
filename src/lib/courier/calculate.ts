export type CourierChargesConfig = {
  enabled: boolean;
  tamilNaduBase: number;
  southStatesBase: number;
  restOfIndiaBase: number;
  qty2To4AddOn: number;
  qty5PlusFlat: number;
  /** When true, courier is ₹0 if orderAmount >= freeShippingMin. */
  freeShippingEnabled: boolean;
  /** Discounted merchandise subtotal threshold (rupees, integer). */
  freeShippingMin: number;
  gstEnabled: boolean;
  gstPercentage: number;
  /** "quantity" (default) uses base + qty rules; "weight" uses weightSlabs. */
  calculationMode?: CourierCalculationMode;
  weightSlabs?: CourierWeightSlab[];
  /** Added per started kg above the last slab's upToKg. */
  weightExtraPerKg?: number;
  /** When false (default), non-IN destinations are blocked. */
  internationalEnabled: boolean;
  internationalZones: InternationalCourierZone[];
};

export type CourierCalculationMode = "quantity" | "weight";

export type CourierWeightSlab = {
  /** Inclusive upper bound; the lower bound is the previous slab's upToKg. */
  upToKg: number;
  tamilNadu: number;
  southStates: number;
  restOfIndia: number;
};

export type InternationalWeightSlab = {
  upToKg: number;
  rate: number;
};

export type InternationalZoneId =
  | "gulf"
  | "north_america"
  | "uk_eu"
  | "asia_pacific"
  | "rest_of_world";

export type InternationalCourierZone = {
  id: InternationalZoneId;
  label: string;
  countryCodes: string[];
  slabs: InternationalWeightSlab[];
  extraPerKg: number;
};

export const DEFAULT_PRODUCT_WEIGHT_KG = 0.5;

export const DEFAULT_COURIER_WEIGHT_SLABS: CourierWeightSlab[] = [
  { upToKg: 1, tamilNadu: 40, southStates: 60, restOfIndia: 75 },
  { upToKg: 2, tamilNadu: 70, southStates: 100, restOfIndia: 120 },
  { upToKg: 4, tamilNadu: 120, southStates: 160, restOfIndia: 200 },
  { upToKg: 5, tamilNadu: 150, southStates: 200, restOfIndia: 250 },
];

export const DEFAULT_COURIER_WEIGHT_EXTRA_PER_KG = 40;

export const DEFAULT_INTERNATIONAL_WEIGHT_SLABS: InternationalWeightSlab[] = [
  { upToKg: 1, rate: 0 },
  { upToKg: 2, rate: 0 },
  { upToKg: 5, rate: 0 },
];

export const DEFAULT_INTERNATIONAL_ZONES: InternationalCourierZone[] = [
  {
    id: "gulf",
    label: "Gulf",
    countryCodes: ["AE", "SA", "QA", "KW", "OM", "BH"],
    slabs: DEFAULT_INTERNATIONAL_WEIGHT_SLABS,
    extraPerKg: 0,
  },
  {
    id: "north_america",
    label: "North America",
    countryCodes: ["US", "CA"],
    slabs: DEFAULT_INTERNATIONAL_WEIGHT_SLABS,
    extraPerKg: 0,
  },
  {
    id: "uk_eu",
    label: "UK / EU",
    countryCodes: ["GB", "IE", "DE", "FR", "IT", "NL", "ES"],
    slabs: DEFAULT_INTERNATIONAL_WEIGHT_SLABS,
    extraPerKg: 0,
  },
  {
    id: "asia_pacific",
    label: "Asia-Pacific",
    countryCodes: ["SG", "MY", "JP", "KR", "AU", "NZ"],
    slabs: DEFAULT_INTERNATIONAL_WEIGHT_SLABS,
    extraPerKg: 0,
  },
  {
    id: "rest_of_world",
    label: "Rest of World",
    countryCodes: [],
    slabs: DEFAULT_INTERNATIONAL_WEIGHT_SLABS,
    extraPerKg: 0,
  },
];

const INTERNATIONAL_ZONE_IDS = new Set<string>(
  DEFAULT_INTERNATIONAL_ZONES.map((zone) => zone.id),
);

function toNonNegativeRupees(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.max(0, Math.round(parsed))
    : Math.max(0, Math.round(fallback));
}

/** Weight in kg rounded to grams; null when not a positive number. */
export function toWeightKg(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed * 1000) / 1000;
}

/** Sanitize slabs: positive unique upToKg, sorted ascending, rupee prices. */
export function normalizeWeightSlabs(raw: unknown): CourierWeightSlab[] {
  if (!Array.isArray(raw)) return DEFAULT_COURIER_WEIGHT_SLABS;
  const byUpTo = new Map<number, CourierWeightSlab>();
  for (const item of raw) {
    const row = (item ?? {}) as Record<string, unknown>;
    const upToKg = toWeightKg(row.upToKg);
    if (upToKg === null) continue;
    byUpTo.set(upToKg, {
      upToKg,
      tamilNadu: toNonNegativeRupees(row.tamilNadu, 0),
      southStates: toNonNegativeRupees(row.southStates, 0),
      restOfIndia: toNonNegativeRupees(row.restOfIndia, 0),
    });
  }
  const slabs = [...byUpTo.values()].sort((a, b) => a.upToKg - b.upToKg);
  return slabs.length > 0 ? slabs : DEFAULT_COURIER_WEIGHT_SLABS;
}

export function parseCourierWeightSettings(
  value: Record<string, unknown>,
): Pick<
  Required<CourierChargesConfig>,
  "calculationMode" | "weightSlabs" | "weightExtraPerKg"
> {
  return {
    calculationMode: value.calculationMode === "weight" ? "weight" : "quantity",
    weightSlabs: normalizeWeightSlabs(value.weightSlabs),
    weightExtraPerKg: toNonNegativeRupees(
      value.weightExtraPerKg,
      DEFAULT_COURIER_WEIGHT_EXTRA_PER_KG,
    ),
  };
}

/** ISO-3166 alpha-2 uppercased; empty/invalid → "". */
export function normalizeCountryCode(value: unknown): string {
  const code = String(value ?? "")
    .trim()
    .toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return code;
}

export function isIndiaCountry(countryCode: unknown): boolean {
  const code = normalizeCountryCode(countryCode);
  return !code || code === "IN";
}

/** Sanitize intl slabs: positive unique upToKg, sorted ascending. */
export function normalizeInternationalWeightSlabs(
  raw: unknown,
): InternationalWeightSlab[] {
  if (!Array.isArray(raw)) return DEFAULT_INTERNATIONAL_WEIGHT_SLABS;
  const byUpTo = new Map<number, InternationalWeightSlab>();
  for (const item of raw) {
    const row = (item ?? {}) as Record<string, unknown>;
    const upToKg = toWeightKg(row.upToKg);
    if (upToKg === null) continue;
    byUpTo.set(upToKg, {
      upToKg,
      rate: toNonNegativeRupees(row.rate, 0),
    });
  }
  const slabs = [...byUpTo.values()].sort((a, b) => a.upToKg - b.upToKg);
  return slabs.length > 0 ? slabs : DEFAULT_INTERNATIONAL_WEIGHT_SLABS;
}

function normalizeCountryCodes(raw: unknown, fallback: string[]): string[] {
  const source = Array.isArray(raw) ? raw : fallback;
  const codes = new Set<string>();
  for (const item of source) {
    const code = normalizeCountryCode(item);
    if (code && code !== "IN") codes.add(code);
  }
  return [...codes];
}

export function normalizeInternationalZones(
  raw: unknown,
): InternationalCourierZone[] {
  const byId = new Map(
    DEFAULT_INTERNATIONAL_ZONES.map((zone) => [zone.id, zone] as const),
  );
  if (Array.isArray(raw)) {
    for (const item of raw) {
      const row = (item ?? {}) as Record<string, unknown>;
      const id = String(row.id ?? "").trim() as InternationalZoneId;
      if (!INTERNATIONAL_ZONE_IDS.has(id)) continue;
      const fallback = byId.get(id)!;
      byId.set(id, {
        id,
        label:
          String(row.label ?? fallback.label).trim() || fallback.label,
        countryCodes:
          id === "rest_of_world"
            ? []
            : normalizeCountryCodes(row.countryCodes, fallback.countryCodes),
        slabs: normalizeInternationalWeightSlabs(row.slabs),
        extraPerKg: toNonNegativeRupees(row.extraPerKg, fallback.extraPerKg),
      });
    }
  }
  return DEFAULT_INTERNATIONAL_ZONES.map((zone) => byId.get(zone.id)!);
}

export function parseInternationalCourierSettings(
  value: Record<string, unknown>,
): Pick<CourierChargesConfig, "internationalEnabled" | "internationalZones"> {
  return {
    internationalEnabled: Boolean(value.internationalEnabled),
    internationalZones: normalizeInternationalZones(value.internationalZones),
  };
}

export function resolveInternationalZone(
  countryCode: string,
  config: Pick<CourierChargesConfig, "internationalZones">,
): InternationalCourierZone {
  const code = normalizeCountryCode(countryCode);
  const zones = normalizeInternationalZones(config.internationalZones);
  const matched = zones.find(
    (zone) =>
      zone.id !== "rest_of_world" && zone.countryCodes.includes(code),
  );
  return matched ?? zones.find((zone) => zone.id === "rest_of_world")!;
}

/** Total shipping weight of physical lines; missing weights use the default. */
export function physicalWeightForShipping(
  lines: Array<{
    quantity: number;
    isDigital?: boolean | null;
    weightKg?: number | string | null;
  }>,
): number {
  const total = lines.reduce((sum, line) => {
    if (line.isDigital) return sum;
    const qty = Number(line.quantity);
    if (!Number.isFinite(qty) || qty <= 0) return sum;
    const unit = toWeightKg(line.weightKg) ?? DEFAULT_PRODUCT_WEIGHT_KG;
    return sum + unit * Math.round(qty);
  }, 0);
  return Math.round(total * 1000) / 1000;
}

export type CourierIndiaRegion =
  | "tamil_nadu"
  | "south_states"
  | "rest_of_india";

export type CourierRegion = CourierIndiaRegion | InternationalZoneId;

export type CourierChargeBreakdown = {
  state: string;
  normalizedState: string;
  quantity: number;
  charge: number;
  ruleApplied:
    | "free_shipping"
    | "no_physical_items"
    | "qty1_base"
    | "qty2_4_add_on"
    | "qty5_plus_flat"
    | "weight_slab"
    | "weight_over_max"
    | "international_disabled";
  region: CourierRegion;
  market: "india" | "international";
  countryCode: string;
  /** False when international shipping is requested but admin has it disabled. */
  available: boolean;
  /** Set when weight mode / international priced the order. */
  weightKg?: number;
};

const SOUTH_STATES = new Set([
  "karnataka",
  "andhra pradesh",
  "andhra",
  "telangana",
  "hyderabad",
  "kerala",
]);

export function normalizeStateForCourier(state: string): string {
  return state.toLowerCase().replace(/\s+/g, " ").trim();
}

function indiaRegionForState(normalizedState: string): CourierIndiaRegion {
  if (
    normalizedState === "tamil nadu" ||
    normalizedState === "tamilnadu"
  ) {
    return "tamil_nadu";
  }
  if (SOUTH_STATES.has(normalizedState)) return "south_states";
  return "rest_of_india";
}

export function calculateInternationalCourierCharge(params: {
  countryCode: string;
  quantity: number;
  weightKg?: number;
  config: CourierChargesConfig;
}): CourierChargeBreakdown {
  const countryCode = normalizeCountryCode(params.countryCode) || "XX";
  const normalizedState = "";
  const rawQuantity = Math.round(Number(params.quantity));
  const zone = resolveInternationalZone(countryCode, params.config);

  if (!params.config.internationalEnabled) {
    return {
      state: params.countryCode,
      normalizedState,
      quantity: Number.isFinite(rawQuantity) ? Math.max(0, rawQuantity) : 0,
      charge: 0,
      ruleApplied: "international_disabled",
      region: zone.id,
      market: "international",
      countryCode,
      available: false,
    };
  }

  if (!Number.isFinite(rawQuantity) || rawQuantity <= 0) {
    return {
      state: params.countryCode,
      normalizedState,
      quantity: 0,
      charge: 0,
      ruleApplied: "no_physical_items",
      region: zone.id,
      market: "international",
      countryCode,
      available: true,
    };
  }

  const quantity = rawQuantity;
  const slabs = normalizeInternationalWeightSlabs(zone.slabs);
  const weightKg =
    toWeightKg(params.weightKg) ?? quantity * DEFAULT_PRODUCT_WEIGHT_KG;
  const slab = slabs.find((item) => weightKg <= item.upToKg + 1e-9);
  if (slab) {
    return {
      state: params.countryCode,
      normalizedState,
      quantity,
      charge: slab.rate,
      ruleApplied: "weight_slab",
      region: zone.id,
      market: "international",
      countryCode,
      available: true,
      weightKg,
    };
  }
  const last = slabs[slabs.length - 1];
  const extraKg = Math.ceil(weightKg - last.upToKg - 1e-9);
  const extraPerKg = toNonNegativeRupees(zone.extraPerKg, 0);
  return {
    state: params.countryCode,
    normalizedState,
    quantity,
    charge: last.rate + extraKg * extraPerKg,
    ruleApplied: "weight_over_max",
    region: zone.id,
    market: "international",
    countryCode,
    available: true,
    weightKg,
  };
}

export function calculateCourierCharge(params: {
  state: string;
  quantity: number;
  /** ISO country; defaults to India. Non-IN uses international kg zones. */
  countryCode?: string;
  /** Total physical weight (kg); required for weight mode / international. */
  weightKg?: number;
  /** Discounted merchandise subtotal (after promo, before courier/GST). India only. */
  orderAmount?: number;
  config: CourierChargesConfig;
}): CourierChargeBreakdown {
  const countryCode = normalizeCountryCode(params.countryCode) || "IN";
  if (!isIndiaCountry(countryCode)) {
    return calculateInternationalCourierCharge({
      countryCode,
      quantity: params.quantity,
      weightKg: params.weightKg,
      config: params.config,
    });
  }

  const normalizedState = normalizeStateForCourier(params.state);
  const rawQuantity = Math.round(Number(params.quantity));
  const config = params.config;
  const region = indiaRegionForState(normalizedState);

  if (!Number.isFinite(rawQuantity) || rawQuantity <= 0) {
    return {
      state: params.state,
      normalizedState,
      quantity: 0,
      charge: 0,
      ruleApplied: "no_physical_items",
      region,
      market: "india",
      countryCode: "IN",
      available: true,
    };
  }

  const quantity = rawQuantity;

  const orderAmount = Number(params.orderAmount);
  const freeMin = Math.max(0, Math.round(Number(config.freeShippingMin) || 0));
  if (
    config.freeShippingEnabled &&
    Number.isFinite(orderAmount) &&
    orderAmount >= freeMin
  ) {
    return {
      state: params.state,
      normalizedState,
      quantity,
      charge: 0,
      ruleApplied: "free_shipping",
      region,
      market: "india",
      countryCode: "IN",
      available: true,
    };
  }

  if (config.calculationMode === "weight") {
    const slabs = normalizeWeightSlabs(config.weightSlabs);
    const weightKg =
      toWeightKg(params.weightKg) ?? quantity * DEFAULT_PRODUCT_WEIGHT_KG;
    const priceFor = (slab: CourierWeightSlab) =>
      region === "tamil_nadu"
        ? slab.tamilNadu
        : region === "south_states"
          ? slab.southStates
          : slab.restOfIndia;
    const slab = slabs.find((item) => weightKg <= item.upToKg + 1e-9);
    if (slab) {
      return {
        state: params.state,
        normalizedState,
        quantity,
        charge: priceFor(slab),
        ruleApplied: "weight_slab",
        region,
        market: "india",
        countryCode: "IN",
        available: true,
        weightKg,
      };
    }
    const last = slabs[slabs.length - 1];
    const extraKg = Math.ceil(weightKg - last.upToKg - 1e-9);
    const extraPerKg = toNonNegativeRupees(
      config.weightExtraPerKg,
      DEFAULT_COURIER_WEIGHT_EXTRA_PER_KG,
    );
    return {
      state: params.state,
      normalizedState,
      quantity,
      charge: priceFor(last) + extraKg * extraPerKg,
      ruleApplied: "weight_over_max",
      region,
      market: "india",
      countryCode: "IN",
      available: true,
      weightKg,
    };
  }

  const base =
    region === "tamil_nadu"
      ? config.tamilNaduBase
      : region === "south_states"
        ? config.southStatesBase
        : config.restOfIndiaBase;

  if (quantity >= 5) {
    return {
      state: params.state,
      normalizedState,
      quantity,
      charge: config.qty5PlusFlat,
      ruleApplied: "qty5_plus_flat",
      region,
      market: "india",
      countryCode: "IN",
      available: true,
    };
  }

  if (quantity >= 2) {
    return {
      state: params.state,
      normalizedState,
      quantity,
      charge: base + config.qty2To4AddOn,
      ruleApplied: "qty2_4_add_on",
      region,
      market: "india",
      countryCode: "IN",
      available: true,
    };
  }

  return {
    state: params.state,
    normalizedState,
    quantity,
    charge: base,
    ruleApplied: "qty1_base",
    region,
    market: "india",
    countryCode: "IN",
    available: true,
  };
}

export function calculateGstAmount(params: {
  taxableAmount: number;
  config: CourierChargesConfig;
}): number {
  if (!params.config.gstEnabled) return 0;
  const amount = Number(params.taxableAmount);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const percentage = Math.max(0, Number(params.config.gstPercentage ?? 0));
  return Math.round(amount * percentage * 100) / 10000;
}

/** Multiplier for storefront-inclusive display (1 when GST off). */
export function getGstInclusiveFactor(
  config: Pick<CourierChargesConfig, "gstEnabled" | "gstPercentage">,
): number {
  if (!config.gstEnabled) return 1;
  const percentage = Math.max(0, Number(config.gstPercentage ?? 0));
  if (!Number.isFinite(percentage) || percentage <= 0) return 1;
  return 1 + percentage / 100;
}

/** Round money to 2 decimal places (rupees). */
export function roundRupeeAmount(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100) / 100;
}

/**
 * Convert an exclusive (DB) amount to GST-inclusive for storefront display.
 * Does not change stored prices; charge math still uses calculateGstAmount.
 */
export function toGstInclusiveAmount(
  exclusiveAmount: number,
  config: Pick<CourierChargesConfig, "gstEnabled" | "gstPercentage">,
): number {
  const exclusive = Number(exclusiveAmount);
  if (!Number.isFinite(exclusive) || exclusive <= 0) return 0;
  return roundRupeeAmount(exclusive * getGstInclusiveFactor(config));
}

/**
 * Single source of truth for checkout / cart totals.
 * GST is applied once on exclusive merchandise + courier (never on inclusive display).
 */
export function buildCheckoutMoneyTotals(params: {
  exclusiveMerchandise: number;
  courierCharge: number;
  config: CourierChargesConfig;
}): {
  exclusiveMerchandise: number;
  courierCharge: number;
  gstAmount: number;
  total: number;
  /** Storefront-visible merchandise (inclusive when GST on). */
  displayMerchandise: number;
  /** Storefront-visible courier (inclusive when GST on). */
  displayCourier: number;
} {
  const exclusiveMerchandise = roundRupeeAmount(
    Math.max(0, Number(params.exclusiveMerchandise) || 0),
  );
  const courierCharge = roundRupeeAmount(
    Math.max(0, Number(params.courierCharge) || 0),
  );
  const gstAmount = calculateGstAmount({
    taxableAmount: exclusiveMerchandise + courierCharge,
    config: params.config,
  });
  const total = roundRupeeAmount(
    exclusiveMerchandise + courierCharge + gstAmount,
  );

  return {
    exclusiveMerchandise,
    courierCharge,
    gstAmount,
    total,
    displayMerchandise: toGstInclusiveAmount(
      exclusiveMerchandise,
      params.config,
    ),
    displayCourier: toGstInclusiveAmount(courierCharge, params.config),
  };
}
