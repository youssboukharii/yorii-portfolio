# yorii-portfolio — Agent Handoff Document

## Project Overview
Portfolio website for Youssef Boukhari (YoRii) — Art Director, Video Editor & Filmmaker.
- **Live URL:** https://yorii.media
- **Stack:** Next.js (App Router), TypeScript, Vanilla CSS
- **Hosting:** Netlify (auto-deploys from GitHub on every push)
- **Repo:** https://github.com/youssboukharii/yorii-portfolio

---

## Recent Changes (session: 2026-05-29)

### 1. In-memory Rate Limiter — `src/lib/rate-limiter.ts` [NEW]
- Sliding window algorithm, no Redis required
- Tracks requests per IP using a `Map` with auto-cleanup every 5 min
- Exposes `checkRateLimit(identifier, { limit, windowMs, blockDurationMs })`
- Exposes `getClientIP(req)` — handles Cloudflare, Vercel, Nginx proxy headers

### 2. Hardened Contact API — `src/app/api/contact/route.ts` [MODIFIED]
Was: zero protection, no validation, no email sending (fell back to mailto).
Now:
- **Rate limit:** 5 requests / 10 min per IP, then blocked 10 min (returns 429 + Retry-After header)
- **Body size guard:** rejects payloads > 16 KB (returns 413)
- **Input validation:** name ≤ 100 chars, email regex + RFC 5321 254 char cap, message ≤ 2000 chars (returns 422 with details)
- **Resend integration:** live, sends styled HTML email to youss.boukhari@gmail.com
- **Security headers:** X-Content-Type-Options, X-Frame-Options, Cache-Control: no-store on every response

### 3. Global Security Headers — `next.config.ts` [MODIFIED]
- CORS locked to `https://yorii.media` for all `/api/*` routes
- HSTS: `max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY` (anti-clickjacking)
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 4. Dependencies Added
- `resend` package installed (v3.x) — used in contact route

---

## Environment Variables

| Key | Where | Status |
|-----|-------|--------|
| `RESEND_API_KEY` | Netlify → Site config → Environment variables | ✅ Set |

---

## Pending / Next Steps

### 1. Resend Domain Verification (recommended)
Currently emails send from `onboarding@resend.dev`.
To send from `contact@yorii.media`:
1. Resend dashboard → Domains → Add `yorii.media`
2. Add the 3 DNS records (SPF, DKIM, DMARC) to domain registrar
3. Update `from` field in `src/app/api/contact/route.ts`:
   ```ts
   from: "YoRii <contact@yorii.media>",
   ```
4. Push → auto-deploys

### 2. Netlify WAF (optional, free)
Netlify dashboard → Security → Enable attack protection on `/api/*`
Blocks automated scrapers at network level before code runs.

### 3. Git author config (cosmetic)
```bash
git config --global user.name "YoRii"
git config --global user.email "ix.sefyu@gmail.com"
```

---

## Deployment Workflow
```bash
# Make changes, then:
git add -A
git commit -m "your message"
git push
# Netlify auto-deploys in ~2 min
```

---

## Architecture Notes
- `src/app/` — Next.js App Router pages and API routes
- `src/lib/` — Shared utilities (rate limiter lives here)
- `src/components/` — React components
- `public/` — Static assets
- Rate limiter is in-memory (resets on server restart) — acceptable for single-server portfolio
- If scaling beyond portfolio use, replace with Redis via `@upstash/ratelimit`
