import {
  addressFormFieldsSchema,
  type AddressFormValues,
} from "../validations/addressFormSchema";

const STORAGE_KEY = "vidhyatex_checkout_address_draft";

const emptyDraft = (): AddressFormValues => ({
  fullName: "",
  email: "",
  mobile: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "IN",
});

export function loadCheckoutAddressDraft(): Partial<AddressFormValues> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    const result = addressFormFieldsSchema.partial().safeParse(parsed);
    if (!result.success) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return result.data;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveCheckoutAddressDraft(values: Partial<AddressFormValues>) {
  if (typeof window === "undefined") return;

  try {
    const payload = { ...emptyDraft(), ...values };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function clearCheckoutAddressDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

export function mergeCheckoutAddressDefaults(
  accountDefaults?: Partial<AddressFormValues>,
): AddressFormValues {
  const base = emptyDraft();
  const draft = loadCheckoutAddressDraft();
  return {
    ...base,
    ...accountDefaults,
    ...draft,
  };
}

/** Prefill checkout address from the cart delivery fields the shopper already entered. */
export function buildCartPincodeDefaults(input: {
  postal_code?: string;
  city?: string;
  state?: string;
  country?: string;
}): Partial<AddressFormValues> {
  const country = String(input.country ?? "IN")
    .trim()
    .toUpperCase();
  const isIndia = !country || country === "IN";

  if (isIndia) {
    const postal_code = String(input.postal_code ?? "")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (postal_code.length !== 6) {
      return country === "IN" ? { country: "IN" } : { country };
    }
    const out: Partial<AddressFormValues> = { postal_code, country: "IN" };
    const city = String(input.city ?? "").trim();
    const state = String(input.state ?? "").trim();
    if (city) out.city = city;
    if (state) out.state = state;
    return out;
  }

  const out: Partial<AddressFormValues> = { country };
  const postal_code = String(input.postal_code ?? "").trim();
  const city = String(input.city ?? "").trim();
  const state = String(input.state ?? "").trim();
  if (postal_code) out.postal_code = postal_code;
  if (city) out.city = city;
  if (state) out.state = state;
  return out;
}
