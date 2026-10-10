import {
  SOCIAL_IMAGE_FALLBACK_PATH,
  absoluteSocialFallbackUrl,
  buildSocialImages,
  resolveSocialImageUrl,
  type SocialImageResolveDeps,
} from "./social-image";

const deps: SocialImageResolveDeps = {
  siteOrigin: "https://vidhyatex.vercel.app",
  resolveMediaUrl: (key: string) => {
    if (key.startsWith("http://") || key.startsWith("https://")) return key;
    if (key.startsWith("/")) return key;
    return `https://cdn.example.com/${key}`;
  },
  buildCdnSocialUrl: (key: string) =>
    `https://vidhyatex-media.vidhyatex.workers.dev/cdn/w=400,q=75,f=jpeg/${key}`,
};

describe("resolveSocialImageUrl", () => {
  it("falls back when key is missing", () => {
    expect(resolveSocialImageUrl(undefined, deps)).toBe(
      `https://vidhyatex.vercel.app${SOCIAL_IMAGE_FALLBACK_PATH}`,
    );
    expect(resolveSocialImageUrl(null, deps)).toBe(
      absoluteSocialFallbackUrl("https://vidhyatex.vercel.app"),
    );
    expect(resolveSocialImageUrl("   ", deps)).toBe(
      absoluteSocialFallbackUrl("https://vidhyatex.vercel.app"),
    );
  });

  it("returns media CDN JPEG URLs for uploads keys", () => {
    expect(resolveSocialImageUrl("uploads/banner.png", deps)).toBe(
      "https://vidhyatex-media.vidhyatex.workers.dev/cdn/w=400,q=75,f=jpeg/uploads/banner.png",
    );
  });

  it("absolutizes relative non-SVG paths", () => {
    expect(resolveSocialImageUrl("/images/og-default.jpg", deps)).toBe(
      "https://vidhyatex.vercel.app/images/og-default.jpg",
    );
  });

  it("rejects SVG paths", () => {
    expect(resolveSocialImageUrl("/images/brand-mark.svg", deps)).toBe(
      absoluteSocialFallbackUrl("https://vidhyatex.vercel.app"),
    );
  });

  it("rejects Next image optimizer URLs", () => {
    expect(
      resolveSocialImageUrl(
        "https://vidhyatex.vercel.app/_next/image?url=%2Fuploads%2Fa.png&w=1200",
        deps,
      ),
    ).toBe(absoluteSocialFallbackUrl("https://vidhyatex.vercel.app"));
  });

  it("rewrites *.r2.dev uploads URLs to media CDN JPEG", () => {
    expect(
      resolveSocialImageUrl(
        "https://pub-7298c413a12641b5ba5dd9bff2d9009f.r2.dev/uploads/a.png",
        deps,
      ),
    ).toBe("https://vidhyatex-media.vidhyatex.workers.dev/cdn/w=400,q=75,f=jpeg/uploads/a.png");
  });

  it("never returns *.r2.dev when CDN rewrite is unavailable", () => {
    const legacyDeps: SocialImageResolveDeps = {
      ...deps,
      buildCdnSocialUrl: () =>
        "https://pub-7298c413a12641b5ba5dd9bff2d9009f.r2.dev/uploads/a.png",
    };
    expect(
      resolveSocialImageUrl(
        "https://pub-7298c413a12641b5ba5dd9bff2d9009f.r2.dev/uploads/a.png",
        legacyDeps,
      ),
    ).toBe(absoluteSocialFallbackUrl("https://vidhyatex.vercel.app"));
  });

  it("rewrites first-party media CDN URLs to social JPEG preset", () => {
    expect(
      resolveSocialImageUrl(
        "https://vidhyatex-media.vidhyatex.workers.dev/cdn/w=800,q=75,f=webp/uploads/x.png",
        deps,
      ),
    ).toBe("https://vidhyatex-media.vidhyatex.workers.dev/cdn/w=400,q=75,f=jpeg/uploads/x.png");
  });
});

describe("buildSocialImages", () => {
  it("returns Metadata-ready openGraph and twitter images", () => {
    const meta = buildSocialImages("uploads/banner.png", "Devin", deps);
    expect(meta.openGraph?.images).toEqual([
      {
        url: "https://vidhyatex-media.vidhyatex.workers.dev/cdn/w=400,q=75,f=jpeg/uploads/banner.png",
        width: 1200,
        height: 630,
        alt: "Devin",
      },
    ]);
    expect(meta.twitter).toEqual({
      card: "summary_large_image",
      images: [
        "https://vidhyatex-media.vidhyatex.workers.dev/cdn/w=400,q=75,f=jpeg/uploads/banner.png",
      ],
    });
  });

  it("uses absolute site JPG fallback when no media key is provided", () => {
    const meta = buildSocialImages(null, "Vidhya Tex", deps);
    expect(meta.openGraph?.images).toEqual([
      {
        url: "https://vidhyatex.vercel.app/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Vidhya Tex",
      },
    ]);
  });
});
