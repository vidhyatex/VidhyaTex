import { addressFormSchema } from "./addressFormSchema";

describe("addressFormSchema", () => {
  it("accepts a valid India address", () => {
    const result = addressFormSchema.safeParse({
      fullName: "Test User",
      email: "buyer@example.com",
      mobile: "9876543210",
      line1: "12 MG Road",
      line2: "",
      city: "Bengaluru",
      state: "Karnataka",
      postal_code: "560001",
      country: "IN",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid international address", () => {
    const result = addressFormSchema.safeParse({
      fullName: "Test User",
      email: "buyer@example.com",
      mobile: "+971501234567",
      line1: "Marina Walk 12",
      line2: "",
      city: "Dubai",
      state: "Dubai",
      postal_code: "00000",
      country: "AE",
    });
    expect(result.success).toBe(true);
  });

  it("rejects India PIN rules for non-India country", () => {
    const result = addressFormSchema.safeParse({
      fullName: "Test User",
      email: "buyer@example.com",
      mobile: "501234567",
      line1: "Marina Walk 12",
      city: "Dubai",
      state: "",
      postal_code: "12",
      country: "AE",
    });
    expect(result.success).toBe(true);
  });
});
