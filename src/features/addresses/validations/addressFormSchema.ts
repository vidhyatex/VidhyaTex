import { z } from "zod";
import { INDIAN_STATES } from "../constants/indianStates";
import { isIndiaCountry, normalizeCountryCode } from "@/lib/courier/calculate";

const emailField = z
  .string()
  .trim()
  .min(1, "Enter your email")
  .email("Enter a valid email address");

export const addressFormSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Enter your full name")
      .max(120, "Name is too long"),
    email: emailField,
    mobile: z.string(),
    line1: z.string().min(5, "Enter your full address").max(200),
    line2: z.string().max(200).optional().or(z.literal("")),
    city: z.string().min(2, "Enter city").max(80),
    state: z.string(),
    postal_code: z.string(),
    country: z
      .string()
      .trim()
      .transform((value) => normalizeCountryCode(value) || value.trim().toUpperCase())
      .refine((value) => /^[A-Z]{2}$/.test(value), "Select a country"),
  })
  .superRefine((values, ctx) => {
    if (isIndiaCountry(values.country)) {
      if (!/^[6-9]\d{9}$/.test(values.mobile)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid 10-digit mobile number",
          path: ["mobile"],
        });
      }
      if (
        !INDIAN_STATES.includes(values.state as (typeof INDIAN_STATES)[number])
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid PIN code to set state",
          path: ["state"],
        });
      }
      if (!/^\d{6}$/.test(values.postal_code)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid 6-digit PIN code",
          path: ["postal_code"],
        });
      }
      return;
    }

    if (!/^\+?[0-9]{8,15}$/.test(values.mobile.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid mobile number (8–15 digits, + optional)",
        path: ["mobile"],
      });
    }
    if (values.state.trim().length > 80) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "State / region is too long",
        path: ["state"],
      });
    }
    if (!/^[A-Za-z0-9][A-Za-z0-9 \-]{1,11}$/.test(values.postal_code.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid postal code (2–12 characters)",
        path: ["postal_code"],
      });
    }
  });

export type AddressFormValues = z.infer<typeof addressFormSchema>;

export type SavedShippingAddress = AddressFormValues & {
  addressId: string;
};
