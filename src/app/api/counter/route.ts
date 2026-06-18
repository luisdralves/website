import { type NextRequest, NextResponse } from "next/server";
import { footer } from "@/content/footer";
import { getCounter, incrementCounter } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const LIMIT = 10;
const WINDOW_MS = 60_000;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = () => {
  try {
    return NextResponse.json({ count: getCounter() });
  } catch (err) {
    console.error("[counter] GET failed:", err);
    return NextResponse.json({ error: footer.errorMessage }, { status: 500 });
  }
};

export const POST = (request: NextRequest) => {
  const ip = getClientIp(request.headers);
  const result = checkRateLimit(`counter:${ip}`, LIMIT, WINDOW_MS);

  if (!result.allowed) {
    return NextResponse.json(
      { error: footer.rateLimitMessage },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(result.retryAfterMs / 1000).toString(),
        },
      },
    );
  }

  try {
    return NextResponse.json({ count: incrementCounter() });
  } catch (err) {
    console.error("[counter] POST failed:", err);
    return NextResponse.json({ error: footer.errorMessage }, { status: 500 });
  }
};
