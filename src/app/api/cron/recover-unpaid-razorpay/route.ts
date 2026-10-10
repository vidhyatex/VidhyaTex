import { NextRequest, NextResponse } from "next/server";
import {
  recoverUnpaidRazorpayOrders,
  repairPaidRazorpaySideEffects,
} from "@/lib/payments/recover-unpaid-razorpay-orders";
import { withRetry } from "@/lib/resilience";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const authHeader = request.headers.get("authorization")?.trim() ?? "";
  if (authHeader === `Bearer ${secret}`) return true;

  return request.headers.get("x-cron-secret")?.trim() === secret;
}

const MINUTE_MS = 60_000;
const DAILY_RUN_INTERVAL_MS = 24 * 60 * MINUTE_MS;

/**
 * Callers pass `?interval=<minutes>` matching their schedule. Without it (the
 * daily Vercel Hobby cron) every unpaid order in the lookback window is checked.
 */
function runIntervalFromRequest(request: NextRequest): number {
  const minutes = Number(request.nextUrl.searchParams.get("interval"));
  if (!Number.isFinite(minutes) || minutes < 1) return DAILY_RUN_INTERVAL_MS;
  return Math.min(minutes, 24 * 60) * MINUTE_MS;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const runIntervalMs = runIntervalFromRequest(request);

  try {
    const recovered = await withRetry(
      () =>
        recoverUnpaidRazorpayOrders({
          lookbackDays: 14,
          limit: 40,
          runIntervalMs,
        }),
      { label: "cron:recover-unpaid-razorpay", attempts: 3 },
    );
    const repaired = await withRetry(
      () => repairPaidRazorpaySideEffects({ lookbackDays: 14, limit: 30 }),
      { label: "cron:repair-side-effects", attempts: 3 },
    );
    return NextResponse.json({ ok: true, recovered, repaired });
  } catch (error) {
    console.error("[cron] recover-unpaid-razorpay failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
