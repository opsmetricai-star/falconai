# FalconAI

AI-native security operations platform: public marketing site plus a working app (auth, assets, event ingest, detection engine, Analyst AI, incidents, reports, API keys, billing).

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in Supabase and Gemini values.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. To become admin: `update public.profiles set is_admin = true where email = 'you@example.com';`
5. `npm run dev` (app) / `npm test` (detection engine tests) / `npm run build`

## Deploy (Vercel)
Add every variable from `.env.example` in the project settings. Never expose `SUPABASE_SERVICE_ROLE_KEY` publicly.
Set Supabase Auth Site URL and redirect URL to `https://<domain>/auth/callback`.

## Payments
Checkout links (Selar) are in `src/lib/site.ts`. Plans activate only via `POST /api/webhooks/selar` (shared secret `SELAR_WEBHOOK_SECRET`) or the admin form on the Billing page. **The webhook payload mapping is an assumption: verify it against Selar's documentation.** Prices $57 / $97 are mapped to Go / Pro by amount.

## Ingest API
`POST /api/ingest` with `Authorization: Bearer fai_...` and `{"events":[{ "event_type": "login_failed", ... }]}` (Pro and Enterprise).

## Known limitations
- Reference pages not publicly reachable or not audited are approximated by generic templates.
- No analyst-ranking or customer-testimonial claims are made; those slots show framework alignment and labelled scenarios.
