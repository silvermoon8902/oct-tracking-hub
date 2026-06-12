# Brightpath Financial — Conversion Tracking Command Center (Demo)

A portfolio demo of an **Offline Conversion Tracking (OCT) / attribution
observability** dashboard for a paid-acquisition team. It models the full
closed feedback loop a senior tracking engineer owns:

```
Landing page / lead form
   → Forth CRM webhook (Lead · Underwriting · Qualified · Enrolled)
   → CallRail (phone calls)
   → Zapier (webhooks · paths · filters · code steps)
   → Google Ads Offline Conversion Import  +  Meta Pixel / CAPI (server-side)
```

…and answers the only question that matters for paid optimization: when a lead
becomes **Qualified** or **Enrolled**, is that signal actually captured,
matched, deduped, attributed, and accepted by Google and Meta — or is it
leaking?

> **Demo note:** every figure is illustrative sample data standing in for the
> live feeds. No real ad accounts, CRM, or PII are connected. Domain mechanics
> are tuned to current (2026) platform behavior — Meta EMQ (1–10), CAPI↔Pixel
> dedup on `event_name + event_id`, Google OCI 90-day click window + Enhanced
> Conversions for Leads recovery, `gclid`/`gbraid`/`wbraid`, and the June 15,
> 2026 Google Ads Data Manager API cutover.

## Pages

| Route | Covers |
| --- | --- |
| **Overview** (`/`) | Loop Health Score, funnel flow → platforms, destination post-back tiles, signal volume & match-quality trend, posted-back vs. CRM revenue, live signal feed, alerts |
| **Funnel & Attribution** (`/funnel`) | Stage conversion, attributed revenue by platform (CRM vs. platform-reported), campaign breakdown, attribution-by-identifier, cohort lag vs. attribution windows, stage→value→event mapping, discrepancy callouts |
| **Identifier Health** (`/identifiers`) | Capture rate per identifier (gclid/gbraid/wbraid/fbclid/fbc/fbp/UTMs/email/phone/event_id), cross-hop drop-off waterfall, source×stage coverage grid, PII hashing hygiene, identifier-loss root-cause log |
| **Zapier & Webhooks** (`/automation`) | Data Manager API migration banner, Zap monitor board, throughput trend, task history with error text, inbound webhook stream, grouped error diagnostics |
| **Platforms** (`/platforms`) | Google Ads OCT status per conversion action, Meta CAPI/Pixel dedup matrix + EMQ breakdown, duplicate/missing/misnamed signal diagnostics, CRM↔platform reconciliation, action_source & dataset-routing audit |

## Tech

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Recharts** for charts
- **lucide-react** for UI icons
- Real product logos served live from the **Simple Icons CDN**
- Real photography from **Unsplash** (via `next/image`)

All mock data and types live in [`src/lib/data.ts`](./src/lib/data.ts) — swap it
for live connectors and the views stay the same.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Deploy to Vercel

Configured via [`vercel.json`](./vercel.json) (framework auto-detected as Next.js).

**Dashboard:** push to GitHub/GitLab → in Vercel **Add New → Project**, import
the repo, keep the detected Next.js defaults, **Deploy**.

**CLI:**
```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

No environment variables required for the demo. Remote images are allowlisted in
[`next.config.ts`](./next.config.ts) (`images.unsplash.com`); brand logos load as
plain `<img>` from `cdn.simpleicons.org` and need no config.
