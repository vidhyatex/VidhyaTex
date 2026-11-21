import {
  publicErrorMessage,
  publicValidationPayload,
} from "@/lib/api/public-error";
import { parseVideoEmbed } from "@/features/testimonials/lib/video";
import db from "@/lib/supabase/db";
import { testimonials } from "@/lib/supabase/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const submitSchema = z
  .object({
    kind: z.enum(["text", "video"]),
    customerName: z.string().trim().min(1).max(120),
    location: z.string().trim().max(120).optional().nullable(),
    quote: z.string().trim().max(2000).optional().nullable(),
    rating: z.coerce.number().int().min(1).max(5).default(5),
    videoUrl: z.string().trim().max(500).optional().nullable(),
    /** Honeypot — must stay empty */
    company: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "text" && !data.quote?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please share a short review.",
        path: ["quote"],
      });
    }
    if (data.kind === "video") {
      const url = data.videoUrl?.trim() ?? "";
      if (!url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Video URL is required for video reviews.",
          path: ["videoUrl"],
        });
      } else if (!parseVideoEmbed(url)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Use a YouTube, Vimeo, or direct MP4/WebM link.",
          path: ["videoUrl"],
        });
      }
    }
  });

/** Public customer testimonial submissions — always unpublished until admin approves. */
export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = submitSchema.safeParse(payload);
  if (!parsed.success) {
    const parseError = parsed as z.SafeParseError<z.infer<typeof submitSchema>>;
    return NextResponse.json(
      publicValidationPayload("Invalid testimonial", parseError.error),
      { status: 400 },
    );
  }

  if (parsed.data.company?.trim()) {
    return NextResponse.json({ ok: true });
  }

  try {
    await db.insert(testimonials).values({
      kind: parsed.data.kind,
      customerName: parsed.data.customerName,
      location: parsed.data.location?.trim() || null,
      quote: parsed.data.quote?.trim() || null,
      rating: parsed.data.rating,
      videoUrl:
        parsed.data.kind === "video"
          ? parsed.data.videoUrl?.trim() || null
          : null,
      isPublished: false,
      order: 0,
    });

    return NextResponse.json(
      {
        ok: true,
        message:
          "Thanks! Your review was submitted and will appear after we approve it.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[storefront/testimonials] POST failed:", error);
    return NextResponse.json(
      {
        message: publicErrorMessage(error, "Could not submit your review."),
      },
      { status: 400 },
    );
  }
}
