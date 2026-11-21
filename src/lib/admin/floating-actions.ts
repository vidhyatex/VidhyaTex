export type FloatingActionsFlags = {
  mail: boolean;
  phone: boolean;
  whatsapp: boolean;
  cart: boolean;
};

export const DEFAULT_FLOATING_ACTIONS: FloatingActionsFlags = {
  mail: true,
  phone: true,
  whatsapp: true,
  cart: true,
};

function toBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1 || value === "1") return true;
  if (value === "false" || value === 0 || value === "0") return false;
  return fallback;
}

export function parseFloatingActionsValue(
  value: unknown,
  isEnabled = true,
): FloatingActionsFlags {
  if (!isEnabled) {
    return {
      mail: false,
      phone: false,
      whatsapp: false,
      cart: false,
    };
  }

  const raw =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    mail: toBool(raw.mail, DEFAULT_FLOATING_ACTIONS.mail),
    phone: toBool(raw.phone, DEFAULT_FLOATING_ACTIONS.phone),
    whatsapp: toBool(raw.whatsapp, DEFAULT_FLOATING_ACTIONS.whatsapp),
    cart: toBool(raw.cart, DEFAULT_FLOATING_ACTIONS.cart),
  };
}

export function normalizeFloatingActionsPayload(
  value: Record<string, unknown>,
): FloatingActionsFlags {
  return parseFloatingActionsValue(value, true);
}
