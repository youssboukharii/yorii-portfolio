import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, getClientIP } from "@/lib/rate-limiter";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Security headers added to every response ──────────────────────────
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Cache-Control": "no-store",
};

// ── Input constraints ─────────────────────────────────────────────────
const MAX_NAME_LEN = 100;
const MAX_EMAIL_LEN = 254; // RFC 5321 max
const MAX_MESSAGE_LEN = 2000;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/**
 * POST /api/contact
 *
 * Rate limiting (no Redis required):
 *   - 5 submissions per IP per 10 minutes (sliding window)
 *   - After exceeding the limit, blocked for 10 minutes
 *
 * Input validation:
 *   - All fields required, length-capped, email format validated
 *   - Request body size capped at 16 KB
 *
 * Option A (current): logs server-side, client falls back to mailto.
 * Option B (Resend):  uncomment the block below + add RESEND_API_KEY to .env.local
 *                     npm install resend
 */
export async function POST(req: NextRequest) {
  // ── 1. Rate limiting ──────────────────────────────────────────────
  const ip = getClientIP(req);
  const rateLimit = checkRateLimit(`contact:${ip}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000, // 10-minute window
    blockDurationMs: 10 * 60 * 1000, // block for 10 min after exceeding
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait before submitting again.",
        retryAfter: rateLimit.retryAfter,
      },
      {
        status: 429,
        headers: {
          ...SECURITY_HEADERS,
          "Retry-After": String(rateLimit.retryAfter ?? 60),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
        },
      }
    );
  }

  // ── 2. Body size guard (prevent huge payloads) ────────────────────
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 16 * 1024) {
    return NextResponse.json(
      { error: "Request too large" },
      { status: 413, headers: SECURITY_HEADERS }
    );
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const { name, email, message } = body as Record<string, unknown>;

    // ── 3. Input validation ──────────────────────────────────────────
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    const validationErrors: string[] = [];

    if (!trimmedName || trimmedName.length > MAX_NAME_LEN) {
      validationErrors.push(`Name must be 1–${MAX_NAME_LEN} characters`);
    }
    if (!trimmedEmail || trimmedEmail.length > MAX_EMAIL_LEN || !EMAIL_REGEX.test(trimmedEmail)) {
      validationErrors.push("Valid email address required");
    }
    if (!trimmedMessage || trimmedMessage.length > MAX_MESSAGE_LEN) {
      validationErrors.push(`Message must be 1–${MAX_MESSAGE_LEN} characters`);
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 422, headers: SECURITY_HEADERS }
      );
    }

    // ── Send email via Resend ─────────────────────────────────────
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "youss.boukhari@gmail.com",
      replyTo: trimmedEmail,
      subject: `New message from ${trimmedName} — yorii.media`,
      text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:2rem;background:#0a0a0a;color:#fff;border:1px solid #222;">
          <h2 style="margin:0 0 0.5rem;font-size:1.2rem;color:#c8ff00;">New portfolio contact</h2>
          <p style="margin:0 0 1.5rem;font-size:0.8rem;color:#888;">Sent from yorii.media</p>
          <p style="margin:0 0 0.3rem;"><strong>Name:</strong> ${trimmedName}</p>
          <p style="margin:0 0 1.5rem;"><strong>Email:</strong> <a href="mailto:${trimmedEmail}" style="color:#c8ff00;">${trimmedEmail}</a></p>
          <div style="background:#111;border:1px solid #222;padding:1rem;white-space:pre-wrap;font-size:0.9rem;line-height:1.6;">${trimmedMessage}</div>
        </div>
      `,
    });

    console.log("[Contact Form] Email sent", { name: trimmedName, ip });

    return NextResponse.json({ ok: true }, { status: 200, headers: SECURITY_HEADERS });
  } catch (err) {
    console.error("[Contact Form Error]", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}
