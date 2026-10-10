import {
  getAllowedAuthOrigins,
  getAuthCallbackUrls,
  resolveOAuthBrowserOrigin,
} from "./site-urls";

describe("resolveOAuthBrowserOrigin", () => {
  const prev = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://vidhyatex.vercel.app";
  });

  afterEach(() => {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = prev;
  });

  it("keeps www when the shopper opened www (PKCE-safe)", () => {
    expect(resolveOAuthBrowserOrigin("https://vidhyatex.vercel.app")).toBe(
      "https://vidhyatex.vercel.app",
    );
  });

  it("keeps apex when the shopper opened apex", () => {
    expect(resolveOAuthBrowserOrigin("https://vidhyatex.vercel.app")).toBe(
      "https://vidhyatex.vercel.app",
    );
  });

  it("falls back to canonical for unknown hosts", () => {
    expect(resolveOAuthBrowserOrigin("https://evil.example")).toBe(
      "https://vidhyatex.vercel.app",
    );
  });
});

describe("getAuthCallbackUrls", () => {
  it("includes apex and www callbacks", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://vidhyatex.vercel.app";
    const urls = getAuthCallbackUrls();
    expect(urls).toEqual(
      expect.arrayContaining([
        "https://vidhyatex.vercel.app/auth/callback",
        "https://vidhyatex.vercel.app/auth/callback",
      ]),
    );
    expect(getAllowedAuthOrigins()).toEqual(
      expect.arrayContaining(["https://vidhyatex.vercel.app", "https://vidhyatex.vercel.app"]),
    );
  });
});
