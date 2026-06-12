/**
 * Demo data for the Brightpath Financial — Conversion Tracking Command Center.
 *
 * This is a portfolio demo. All values are illustrative sample data standing in
 * for the live feeds (Forth CRM webhooks, CallRail, Zapier, Google Ads offline
 * conversion import, Meta Pixel / CAPI). It models the real closed-loop:
 *   Landing page -> Forth CRM -> CallRail -> Zapier -> Google Ads OCT + Meta CAPI
 * with identifiers gclid / gbraid / wbraid / fbclid / fbc / fbp / UTMs / email / phone
 * and event_id-based pixel<->CAPI deduplication.
 *
 * Domain figures are tuned to current (2026) platform mechanics: Meta EMQ 1-10,
 * dedup on event_name + event_id, Google OCI 90-day click window + Enhanced
 * Conversions for Leads recovery, and the June 15 2026 Data Manager API cutover.
 */

export const ACCOUNT = {
  brand: "Brightpath Financial",
  vertical: "Debt Relief & Settlement",
  product: "Conversion Tracking Command Center",
  environment: "Production",
  window: "Last 30 days",
  metaDataset: "1184422965537001",
  googleCustomer: "412-885-9067",
  lastSync: "Today, 3:04 PM CT",
};

/* Chart palette (kept in sync with globals.css) */
export const PALETTE = {
  indigo: "#6366f1",
  emerald: "#10b981",
  sky: "#0ea5e9",
  amber: "#f59e0b",
  rose: "#f43f5e",
  violet: "#8b5cf6",
  slate: "#64748b",
  google: "#1a73e8",
  meta: "#0866ff",
  matched: "#16a34a",
  warn: "#d97706",
  error: "#e11d48",
  dropped: "#94a3b8",
  ink: "#0b1220",
};

export const PLATFORM_COLORS: Record<string, string> = {
  Google: PALETTE.google,
  "Google Ads": PALETTE.google,
  Meta: PALETTE.meta,
  "CallRail (Phone)": PALETTE.violet,
  Organic: PALETTE.slate,
  "Organic / Direct": PALETTE.slate,
};

/* ----------------------------------------------------------------------- */
/* Executive KPIs                                                          */
/* ----------------------------------------------------------------------- */

export type Tone = "good" | "watch" | "bad";

export type Kpi = {
  id: string;
  label: string;
  value: string;
  target: string;
  delta: number; // % change vs prior period
  deltaLabel: string;
  icon: string; // lucide icon name
  tone: Tone;
  goodWhenUp: boolean;
  primary: boolean;
};

export const KPIS: Kpi[] = [
  {
    id: "attribution-coverage",
    label: "Offline Attribution Coverage",
    value: "77%",
    target: "Target 75%+ → 85%",
    delta: 3.4,
    deltaLabel: "vs. prior 30d",
    icon: "Workflow",
    tone: "watch",
    goodWhenUp: true,
    primary: true,
  },
  {
    id: "google-match",
    label: "Google Offline Match Rate",
    value: "82%",
    target: "Blended 80%+ (gclid 71% + ECL)",
    delta: 4.1,
    deltaLabel: "vs. prior 30d",
    icon: "Target",
    tone: "good",
    goodWhenUp: true,
    primary: true,
  },
  {
    id: "meta-emq",
    label: "Meta Event Match Quality",
    value: "7.2 / 6.8",
    target: "Lead / Purchase · 7.0+ goal",
    delta: 2.6,
    deltaLabel: "EMQ vs. prior 30d",
    icon: "Gauge",
    tone: "good",
    goodWhenUp: true,
    primary: true,
  },
  {
    id: "dedup-rate",
    label: "CAPI↔Pixel Dedup Rate",
    value: "98.4%",
    target: "95%+ on paired events",
    delta: 0.5,
    deltaLabel: "vs. prior 30d",
    icon: "Copy",
    tone: "good",
    goodWhenUp: true,
    primary: true,
  },
  {
    id: "id-capture",
    label: "Identifier Capture Rate",
    value: "84%",
    target: "Click-ID 85%+ · PII 97%+",
    delta: -1.8,
    deltaLabel: "click-ID vs. prior 30d",
    icon: "Fingerprint",
    tone: "watch",
    goodWhenUp: true,
    primary: true,
  },
  {
    id: "zap-success",
    label: "Zapier Pipeline Success",
    value: "99.1%",
    target: "99%+ · <1% error/replay",
    delta: 0.3,
    deltaLabel: "vs. prior 30d",
    icon: "Activity",
    tone: "good",
    goodWhenUp: true,
    primary: true,
  },
  {
    id: "signal-latency",
    label: "Signal Latency (Lead→Platform)",
    value: "34 min",
    target: "<1h median · p95 <6h",
    delta: -12.0,
    deltaLabel: "median vs. prior 30d",
    icon: "Timer",
    tone: "good",
    goodWhenUp: false,
    primary: true,
  },
  {
    id: "cost-per-enrolled",
    label: "Cost / Enrolled (Closed-Loop)",
    value: "$418 / $506",
    target: "Google / Meta · at-or-below CPA",
    delta: -5.2,
    deltaLabel: "blended vs. prior 30d",
    icon: "DollarSign",
    tone: "good",
    goodWhenUp: false,
    primary: true,
  },
  {
    id: "signals-passed",
    label: "Qualified / Enrolled Passed Back",
    value: "1,330 / 415",
    target: "100% of eligible stage events",
    delta: 6.1,
    deltaLabel: "vs. prior 30d",
    icon: "Send",
    tone: "good",
    goodWhenUp: true,
    primary: false,
  },
  {
    id: "crm-discrepancy",
    label: "CRM Discrepancy",
    value: "+6% / +12%",
    target: "Google / Meta · within ±10%",
    delta: 1.5,
    deltaLabel: "Meta gap vs. prior 30d",
    icon: "Scale",
    tone: "watch",
    goodWhenUp: false,
    primary: false,
  },
  {
    id: "fbc-fbp",
    label: "fbc / fbp Presence (CAPI)",
    value: "73% / 96%",
    target: "fbc 70%+ · fbp 95%+",
    delta: -2.1,
    deltaLabel: "fbc vs. prior 30d",
    icon: "Cookie",
    tone: "watch",
    goodWhenUp: true,
    primary: false,
  },
  {
    id: "pii-hash",
    label: "PII Hash Validity",
    value: "97.6%",
    target: "98%+ normalized SHA-256",
    delta: 0.4,
    deltaLabel: "vs. prior 30d",
    icon: "ShieldCheck",
    tone: "watch",
    goodWhenUp: true,
    primary: false,
  },
];

export const PRIMARY_KPIS = KPIS.filter((k) => k.primary);

/* ----------------------------------------------------------------------- */
/* Daily roll-up time series (30 days)                                     */
/* ----------------------------------------------------------------------- */

export type DailyPoint = {
  date: string; // M/D
  leads: number;
  qualified: number;
  enrolled: number;
  trackedRevenue: number;
  eventsSent: number;
  avgEmq: number;
  googleOci: number; // success %
  metaCapi: number; // success %
  matched: number; // matched conversions %
  zapErrors: number;
};

// 30 days with weekday/weekend seasonality and one Meta auth-outage dip.
export const DAILY: DailyPoint[] = [
  { date: "5/11", leads: 188, qualified: 41, enrolled: 12, trackedRevenue: 50400, eventsSent: 1020, avgEmq: 8.0, googleOci: 96.4, metaCapi: 98.1, matched: 87, zapErrors: 3 },
  { date: "5/12", leads: 214, qualified: 47, enrolled: 14, trackedRevenue: 58800, eventsSent: 1124, avgEmq: 8.2, googleOci: 96.0, metaCapi: 98.4, matched: 88, zapErrors: 4 },
  { date: "5/13", leads: 221, qualified: 49, enrolled: 15, trackedRevenue: 63000, eventsSent: 1180, avgEmq: 8.3, googleOci: 95.8, metaCapi: 98.6, matched: 89, zapErrors: 2 },
  { date: "5/14", leads: 209, qualified: 44, enrolled: 13, trackedRevenue: 54600, eventsSent: 1098, avgEmq: 8.1, googleOci: 96.2, metaCapi: 98.0, matched: 88, zapErrors: 5 },
  { date: "5/15", leads: 198, qualified: 43, enrolled: 13, trackedRevenue: 54600, eventsSent: 1064, avgEmq: 7.9, googleOci: 95.5, metaCapi: 82.0, matched: 81, zapErrors: 31 },
  { date: "5/16", leads: 142, qualified: 28, enrolled: 8, trackedRevenue: 33600, eventsSent: 760, avgEmq: 8.0, googleOci: 96.1, metaCapi: 98.2, matched: 88, zapErrors: 6 },
  { date: "5/17", leads: 121, qualified: 22, enrolled: 6, trackedRevenue: 25200, eventsSent: 642, avgEmq: 8.1, googleOci: 96.3, metaCapi: 98.5, matched: 89, zapErrors: 2 },
  { date: "5/18", leads: 203, qualified: 45, enrolled: 14, trackedRevenue: 58800, eventsSent: 1086, avgEmq: 8.2, googleOci: 96.0, metaCapi: 98.3, matched: 88, zapErrors: 3 },
  { date: "5/19", leads: 226, qualified: 50, enrolled: 16, trackedRevenue: 67200, eventsSent: 1198, avgEmq: 8.4, googleOci: 95.9, metaCapi: 98.7, matched: 90, zapErrors: 1 },
  { date: "5/20", leads: 231, qualified: 52, enrolled: 16, trackedRevenue: 67200, eventsSent: 1224, avgEmq: 8.3, googleOci: 96.5, metaCapi: 98.4, matched: 89, zapErrors: 4 },
  { date: "5/21", leads: 218, qualified: 47, enrolled: 15, trackedRevenue: 63000, eventsSent: 1150, avgEmq: 8.2, googleOci: 96.1, metaCapi: 98.6, matched: 88, zapErrors: 3 },
  { date: "5/22", leads: 205, qualified: 45, enrolled: 14, trackedRevenue: 58800, eventsSent: 1092, avgEmq: 8.1, googleOci: 95.7, metaCapi: 98.0, matched: 87, zapErrors: 5 },
  { date: "5/23", leads: 148, qualified: 30, enrolled: 9, trackedRevenue: 37800, eventsSent: 792, avgEmq: 8.0, googleOci: 96.2, metaCapi: 98.3, matched: 88, zapErrors: 2 },
  { date: "5/24", leads: 126, qualified: 24, enrolled: 7, trackedRevenue: 29400, eventsSent: 668, avgEmq: 8.1, googleOci: 96.4, metaCapi: 98.5, matched: 89, zapErrors: 1 },
  { date: "5/25", leads: 210, qualified: 46, enrolled: 14, trackedRevenue: 58800, eventsSent: 1110, avgEmq: 8.3, googleOci: 96.0, metaCapi: 98.4, matched: 89, zapErrors: 3 },
  { date: "5/26", leads: 224, qualified: 49, enrolled: 15, trackedRevenue: 63000, eventsSent: 1186, avgEmq: 8.4, googleOci: 95.8, metaCapi: 98.6, matched: 90, zapErrors: 2 },
  { date: "5/27", leads: 233, qualified: 53, enrolled: 17, trackedRevenue: 71400, eventsSent: 1238, avgEmq: 8.5, googleOci: 96.3, metaCapi: 98.7, matched: 90, zapErrors: 1 },
  { date: "5/28", leads: 219, qualified: 48, enrolled: 15, trackedRevenue: 63000, eventsSent: 1158, avgEmq: 8.3, googleOci: 96.1, metaCapi: 98.5, matched: 89, zapErrors: 4 },
  { date: "5/29", leads: 207, qualified: 45, enrolled: 14, trackedRevenue: 58800, eventsSent: 1100, avgEmq: 8.2, googleOci: 95.9, metaCapi: 98.2, matched: 88, zapErrors: 3 },
  { date: "5/30", leads: 151, qualified: 31, enrolled: 9, trackedRevenue: 37800, eventsSent: 804, avgEmq: 8.1, googleOci: 96.2, metaCapi: 98.4, matched: 88, zapErrors: 2 },
  { date: "5/31", leads: 129, qualified: 25, enrolled: 7, trackedRevenue: 29400, eventsSent: 684, avgEmq: 8.0, googleOci: 96.5, metaCapi: 98.6, matched: 89, zapErrors: 1 },
  { date: "6/1", leads: 212, qualified: 47, enrolled: 14, trackedRevenue: 58800, eventsSent: 1122, avgEmq: 8.3, googleOci: 96.0, metaCapi: 98.5, matched: 89, zapErrors: 3 },
  { date: "6/2", leads: 228, qualified: 51, enrolled: 16, trackedRevenue: 67200, eventsSent: 1206, avgEmq: 8.4, googleOci: 95.7, metaCapi: 98.7, matched: 90, zapErrors: 2 },
  { date: "6/3", leads: 235, qualified: 54, enrolled: 17, trackedRevenue: 71400, eventsSent: 1246, avgEmq: 8.5, googleOci: 96.4, metaCapi: 98.6, matched: 90, zapErrors: 1 },
  { date: "6/4", leads: 222, qualified: 49, enrolled: 15, trackedRevenue: 63000, eventsSent: 1174, avgEmq: 8.3, googleOci: 96.1, metaCapi: 98.4, matched: 89, zapErrors: 4 },
  { date: "6/5", leads: 208, qualified: 46, enrolled: 14, trackedRevenue: 58800, eventsSent: 1102, avgEmq: 8.2, googleOci: 95.8, metaCapi: 98.3, matched: 88, zapErrors: 3 },
  { date: "6/6", leads: 153, qualified: 31, enrolled: 9, trackedRevenue: 37800, eventsSent: 812, avgEmq: 8.1, googleOci: 96.3, metaCapi: 98.5, matched: 88, zapErrors: 2 },
  { date: "6/7", leads: 131, qualified: 26, enrolled: 8, trackedRevenue: 33600, eventsSent: 696, avgEmq: 8.0, googleOci: 96.5, metaCapi: 98.6, matched: 89, zapErrors: 1 },
  { date: "6/8", leads: 216, qualified: 48, enrolled: 15, trackedRevenue: 63000, eventsSent: 1142, avgEmq: 8.3, googleOci: 96.0, metaCapi: 98.4, matched: 89, zapErrors: 3 },
  { date: "6/9", leads: 214, qualified: 73, enrolled: 19, trackedRevenue: 79800, eventsSent: 1120, avgEmq: 8.2, googleOci: 96.1, metaCapi: 98.4, matched: 88, zapErrors: 4 },
];

/* ----------------------------------------------------------------------- */
/* Funnel flow (Lead -> Underwriting -> Qualified -> Enrolled)             */
/* ----------------------------------------------------------------------- */

export type FunnelStage = {
  stage: string;
  count: number;
  cvr: number | null; // conversion from prior stage (%)
  avgDays: number;
  value: number; // tracked value attached at this stage
  postedGoogle: number; // signals posted to Google OCT
  postedMeta: number; // signals posted to Meta CAPI
  leakage: number; // outcomes that never posted back
};

export const FUNNEL: FunnelStage[] = [
  { stage: "Lead", count: 6180, cvr: null, avgDays: 0, value: 0, postedGoogle: 5240, postedMeta: 5610, leakage: 0 },
  { stage: "Underwriting", count: 2940, cvr: 47.6, avgDays: 2, value: 0, postedGoogle: 2510, postedMeta: 2680, leakage: 0 },
  { stage: "Qualified", count: 1330, cvr: 45.2, avgDays: 6, value: 1995000, postedGoogle: 1208, postedMeta: 1262, leakage: 122 },
  { stage: "Enrolled", count: 415, cvr: 31.2, avgDays: 19, value: 1743000, postedGoogle: 357, postedMeta: 372, leakage: 58 },
];

/* ----------------------------------------------------------------------- */
/* Destination post-back tiles                                             */
/* ----------------------------------------------------------------------- */

export type Destination = {
  id: string;
  name: string;
  detail: string;
  slug: string | null; // simpleicons slug, or null -> lucide icon
  icon: string | null; // lucide name when no brand logo
  color: string;
  sent: number;
  accepted: number;
  acceptedRate: number;
  metricLabel: string;
  metricValue: string;
  spark: number[];
};

export const DESTINATIONS: Destination[] = [
  {
    id: "google-oct",
    name: "Google Ads — Offline Conversions",
    detail: "gclid / gbraid / wbraid + ECL",
    slug: "googleads",
    icon: null,
    color: PALETTE.google,
    sent: 1612,
    accepted: 1418,
    acceptedRate: 88.0,
    metricLabel: "Value imported",
    metricValue: "$1.49M",
    spark: [86, 87, 85, 88, 87, 89, 88],
  },
  {
    id: "meta-capi",
    name: "Meta — Conversions API",
    detail: "Server-side · dataset ••7001",
    slug: "meta",
    icon: null,
    color: PALETTE.meta,
    sent: 1705,
    accepted: 1612,
    acceptedRate: 94.5,
    metricLabel: "Avg EMQ",
    metricValue: "7.0",
    spark: [93, 94, 92, 95, 94, 95, 94],
  },
  {
    id: "meta-pixel",
    name: "Meta — Browser Pixel",
    detail: "Deduped with CAPI on event_id",
    slug: "meta",
    icon: null,
    color: PALETTE.violet,
    sent: 1486,
    accepted: 1462,
    acceptedRate: 98.4,
    metricLabel: "Deduped",
    metricValue: "98.4%",
    spark: [98, 98, 97, 98, 99, 98, 98],
  },
  {
    id: "callrail-oct",
    name: "CallRail — Phone Conversions",
    detail: "action_source: phone_call",
    slug: null,
    icon: "PhoneCall",
    color: PALETTE.amber,
    sent: 408,
    accepted: 351,
    acceptedRate: 86.0,
    metricLabel: "Calls tagged",
    metricValue: "408",
    spark: [84, 85, 86, 85, 87, 86, 86],
  },
];

/* ----------------------------------------------------------------------- */
/* Live signal activity feed                                               */
/* ----------------------------------------------------------------------- */

export type SignalEvent = {
  id: string;
  eventName: string;
  stage: string;
  source: "Google" | "Meta" | "CallRail" | "Forth";
  detail: string;
  value: number | null;
  status: "Matched" | "Deduped" | "Dropped" | "Received" | "Duplicate";
  destination: string;
  time: string;
  emq?: number;
};

export const SIGNAL_FEED: SignalEvent[] = [
  { id: "evt_8f3c1a9e", eventName: "Purchase", stage: "Enrolled", source: "Google", detail: "gclid matched · ECL email+phone", value: 4200, status: "Matched", destination: "Google OCT", time: "32s ago" },
  { id: "evt_2b71d04a", eventName: "Purchase", stage: "Enrolled", source: "Meta", detail: "event_id dedup OK · fbc+fbp present", value: 4200, status: "Deduped", destination: "Meta CAPI", time: "1m ago", emq: 8.4 },
  { id: "evt_5c93f1e8", eventName: "Lead", stage: "Lead", source: "Meta", detail: "fbclid missing → fbc not set", value: null, status: "Received", destination: "Meta CAPI", time: "2m ago", emq: 4.3 },
  { id: "evt_a17e6620", eventName: "SubmitApplication", stage: "Qualified", source: "Google", detail: "wbraid keyed · 72h processing", value: 0, status: "Received", destination: "Google OCT", time: "4m ago" },
  { id: "evt_9d44b002", eventName: "Lead", stage: "Lead", source: "CallRail", detail: "phone_call · gclid + phone, no fbc", value: null, status: "Matched", destination: "Google OCT", time: "5m ago" },
  { id: "evt_3f82c7aa", eventName: "Purchase", stage: "Enrolled", source: "Meta", detail: "event_id collision · Zap double-fire", value: 4200, status: "Duplicate", destination: "Meta CAPI", time: "7m ago" },
  { id: "evt_61bb90c4", eventName: "Schedule", stage: "Qualified", source: "Meta", detail: "deduped · Spanish LP dataset", value: 0, status: "Deduped", destination: "Meta CAPI", time: "9m ago", emq: 7.8 },
  { id: "evt_0aa7f135", eventName: "Purchase", stage: "Enrolled", source: "Google", detail: "EXPIRED_GCLID · click >90 days", value: 4200, status: "Dropped", destination: "Google OCT", time: "12m ago" },
];

/* ----------------------------------------------------------------------- */
/* Active alerts                                                           */
/* ----------------------------------------------------------------------- */

export type Alert = {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  page: string;
  pageLabel: string;
};

export const ALERTS: Alert[] = [
  { id: "al1", severity: "critical", title: "Meta dataset: 1 event from 1 source", detail: "Purchase on Spanish LP not deduping — event_id missing on browser pixel.", page: "/platforms", pageLabel: "Platforms" },
  { id: "al2", severity: "warning", title: "gbraid capture down 22% on iOS landing variant B", detail: "302 redirect stripping the braid param before form render.", page: "/identifiers", pageLabel: "Identifiers" },
  { id: "al3", severity: "warning", title: "38 unattributed Enrolled conversions in Google Ads", detail: "gclid older than the 90-day window — recover via ECL fallback.", page: "/platforms", pageLabel: "Platforms" },
  { id: "al4", severity: "info", title: "Data Manager API migration due Jun 15, 2026", detail: "2 Zaps still upload via legacy Google Ads API offline path.", page: "/automation", pageLabel: "Automation" },
];

/* ----------------------------------------------------------------------- */
/* Funnel & Attribution                                                    */
/* ----------------------------------------------------------------------- */

export type PlatformAttribution = {
  platform: string;
  leads: number;
  qualified: number;
  enrolled: number;
  crmValue: number; // CRM source-of-truth value
  platformValue: number; // value the platform reports
  spend: number;
  cpa: number; // cost per enrolled
  roas: number;
};

export const ATTRIBUTION: PlatformAttribution[] = [
  { platform: "Google Ads", leads: 2980, qualified: 690, enrolled: 214, crmValue: 898800, platformValue: 952700, spend: 89500, cpa: 418, roas: 10.0 },
  { platform: "Meta", leads: 2310, qualified: 470, enrolled: 142, crmValue: 596400, platformValue: 668000, spend: 71900, cpa: 506, roas: 8.3 },
  { platform: "CallRail (Phone)", leads: 612, qualified: 118, enrolled: 41, crmValue: 172200, platformValue: 158400, spend: 0, cpa: 0, roas: 0 },
  { platform: "Organic / Direct", leads: 278, qualified: 52, enrolled: 18, crmValue: 75600, platformValue: 0, spend: 0, cpa: 0, roas: 0 },
];

export type Campaign = {
  platform: string;
  name: string;
  enrolled: number;
  value: number;
  spend: number;
  cpa: number;
};

export const CAMPAIGNS: Campaign[] = [
  { platform: "Google", name: "Brand — DebtRelief — Exact", enrolled: 64, value: 268800, spend: 14200, cpa: 222 },
  { platform: "Google", name: "NonBrand — Settlement — Phrase", enrolled: 88, value: 369600, spend: 41800, cpa: 475 },
  { platform: "Google", name: "PMax — DebtRelief — National", enrolled: 62, value: 260400, spend: 33500, cpa: 540 },
  { platform: "Meta", name: "Lookalike — DebtAmount 25k+", enrolled: 71, value: 298200, spend: 32400, cpa: 456 },
  { platform: "Meta", name: "Advantage+ — Broad — Enrolled", enrolled: 48, value: 201600, spend: 26800, cpa: 558 },
  { platform: "Meta", name: "Retargeting — Application Started", enrolled: 23, value: 96600, spend: 12700, cpa: 552 },
];

export type IdentifierAttribution = {
  identifier: string;
  enrolled: number;
  value: number;
  share: number; // % of attributed conversions
};

export const ATTRIBUTION_BY_IDENTIFIER: IdentifierAttribution[] = [
  { identifier: "gclid", enrolled: 152, value: 638400, share: 36.6 },
  { identifier: "Enhanced Conversions (email+phone)", enrolled: 71, value: 298200, share: 17.1 },
  { identifier: "fbc (Meta click)", enrolled: 86, value: 361200, share: 20.7 },
  { identifier: "fbp + email (CAPI)", enrolled: 48, value: 201600, share: 11.6 },
  { identifier: "wbraid / gbraid (iOS)", enrolled: 32, value: 134400, share: 7.7 },
  { identifier: "phone (CAPI / ECL)", enrolled: 26, value: 109200, share: 6.3 },
];

/* Days from Lead -> Enrolled distribution (cohort lag) */
export type LagBucket = { bucket: string; google: number; meta: number };
export const LAG_DISTRIBUTION: LagBucket[] = [
  { bucket: "0–7d", google: 18, meta: 22 },
  { bucket: "8–30d", google: 64, meta: 58 },
  { bucket: "31–60d", google: 71, meta: 44 },
  { bucket: "61–90d", google: 43, meta: 14 },
  { bucket: "90d+ (at risk)", google: 18, meta: 4 },
];

/* Stage -> value -> platform mapping */
export type StageMapping = {
  stage: string;
  value: string;
  googleAction: string;
  metaEvent: string;
};
export const STAGE_MAPPING: StageMapping[] = [
  { stage: "Lead", value: "$0 (micro)", googleAction: "Lead — Offline (CRM)", metaEvent: "Lead" },
  { stage: "Underwriting", value: "$0 (micro)", googleAction: "Application — Offline", metaEvent: "SubmitApplication" },
  { stage: "Qualified", value: "$1,500 (mid)", googleAction: "Qualified — Offline (CRM)", metaEvent: "Schedule (custom)" },
  { stage: "Enrolled", value: "$4,200 (full)", googleAction: "Enrolled — Offline (CRM)", metaEvent: "Purchase" },
];

/* ----------------------------------------------------------------------- */
/* Identifier capture health                                               */
/* ----------------------------------------------------------------------- */

export type IdentifierRate = {
  id: string;
  label: string;
  capture: number; // %
  target: number; // %
  trend: number[]; // 7-day sparkline
  note: string;
};

export const IDENTIFIER_RATES: IdentifierRate[] = [
  { id: "gclid", label: "gclid", capture: 71, target: 75, trend: [73, 72, 72, 71, 71, 70, 71], note: "Google web click ID" },
  { id: "gbraid", label: "gbraid", capture: 6, target: 8, trend: [8, 7, 7, 6, 5, 6, 6], note: "iOS web→app (privacy-safe)" },
  { id: "wbraid", label: "wbraid", capture: 5, target: 6, trend: [6, 6, 5, 5, 5, 5, 5], note: "iOS app→web" },
  { id: "fbclid", label: "fbclid", capture: 62, target: 65, trend: [64, 63, 63, 62, 62, 61, 62], note: "Meta click param" },
  { id: "fbc", label: "fbc", capture: 73, target: 70, trend: [75, 74, 74, 73, 73, 72, 73], note: "Built from fbclid at click time" },
  { id: "fbp", label: "fbp", capture: 96, target: 95, trend: [96, 96, 95, 96, 96, 95, 96], note: "Meta browser cookie" },
  { id: "utm", label: "UTMs", capture: 95, target: 95, trend: [95, 95, 96, 95, 95, 95, 95], note: "source/medium/campaign/term/content" },
  { id: "email", label: "email", capture: 99, target: 97, trend: [99, 99, 99, 99, 99, 99, 99], note: "Normalized + SHA-256" },
  { id: "phone", label: "phone", capture: 93, target: 97, trend: [94, 94, 93, 93, 93, 92, 93], note: "E.164 + SHA-256" },
  { id: "event_id", label: "event_id", capture: 100, target: 100, trend: [100, 100, 100, 100, 100, 100, 100], note: "Dedup key (pixel ↔ CAPI)" },
];

/* Cross-hop drop-off waterfall for a selected identifier (fbc) */
export type HopPoint = { hop: string; present: number };
export const FBC_WATERFALL: HopPoint[] = [
  { hop: "Landing page", present: 100 },
  { hop: "Lead form submit", present: 96 },
  { hop: "Forth CRM webhook", present: 88 },
  { hop: "Zapier transform", present: 74 },
  { hop: "Meta CAPI payload", present: 73 },
];

export const GCLID_WATERFALL: HopPoint[] = [
  { hop: "Landing page", present: 100 },
  { hop: "Lead form submit", present: 94 },
  { hop: "Forth CRM webhook", present: 86 },
  { hop: "Zapier transform", present: 84 },
  { hop: "Google OCT payload", present: 82 },
];

/* Coverage grid: source x stage */
export type CoverageRow = {
  source: string;
  stage: string;
  records: number;
  gclid: number;
  fbc: number;
  fbp: number;
  email: number;
  phone: number;
  fullMatchKey: number;
  health: "Healthy" | "Watch" | "Critical";
};

export const COVERAGE: CoverageRow[] = [
  { source: "Google", stage: "Lead", records: 1840, gclid: 71, fbc: 1, fbp: 2, email: 97, phone: 93, fullMatchKey: 68, health: "Healthy" },
  { source: "Meta", stage: "Lead", records: 1610, gclid: 1, fbc: 84, fbp: 96, email: 96, phone: 90, fullMatchKey: 79, health: "Healthy" },
  { source: "CallRail", stage: "Lead", records: 612, gclid: 60, fbc: 0, fbp: 0, email: 55, phone: 99, fullMatchKey: 41, health: "Watch" },
  { source: "Meta", stage: "Qualified", records: 470, gclid: 1, fbc: 71, fbp: 92, email: 97, phone: 91, fullMatchKey: 70, health: "Watch" },
  { source: "Meta", stage: "Enrolled", records: 142, gclid: 1, fbc: 62, fbp: 88, email: 98, phone: 92, fullMatchKey: 61, health: "Critical" },
  { source: "Google", stage: "Enrolled", records: 214, gclid: 64, fbc: 0, fbp: 0, email: 98, phone: 94, fullMatchKey: 63, health: "Healthy" },
];

/* PII hygiene */
export const PII_HYGIENE = [
  { check: "Email lowercased + trimmed", conforming: 99.2 },
  { check: "Email SHA-256 (hex, 64 char)", conforming: 98.8 },
  { check: "Phone E.164 normalized", conforming: 94.1 },
  { check: "Phone SHA-256 (hex, 64 char)", conforming: 97.6 },
  { check: "No double-hash / plaintext leak", conforming: 99.6 },
];

/* Identifier-loss root cause log */
export type LeakPattern = { pattern: string; hop: string; affected: number; fix: string };
export const LEAK_PATTERNS: LeakPattern[] = [
  { pattern: "Landing variant B drops wbraid on 302 redirect", hop: "Landing → Form", affected: 142, fix: "Preserve full query string through redirect" },
  { pattern: "Forth webhook omits fbp for phone-first leads", hop: "CRM webhook", affected: 88, fix: "Persist fbp cookie onto contact at form submit" },
  { pattern: "Zapier step strips utm_content over 255 chars", hop: "Zapier transform", affected: 36, fix: "Truncate-safe mapping / use long-text field" },
  { pattern: "fbc rebuilt with wrong timestamp format", hop: "Zapier transform", affected: 24, fix: "fbc = fb.1.<click_ts_ms>.<fbclid>" },
];

/* ----------------------------------------------------------------------- */
/* Zapier & webhooks                                                       */
/* ----------------------------------------------------------------------- */

export type Zap = {
  id: string;
  name: string;
  status: "Active" | "Paused";
  trigger: string;
  actions: string[];
  steps: number;
  runs30d: number;
  successRate: number;
  tasksUsed: number;
  lastRun: string;
  legacyApi: boolean; // still on legacy Google Ads API offline path
};

export const ZAPS: Zap[] = [
  { id: "zap_oci_enroll", name: "Forth Enrolled → Google OCI + Meta CAPI Purchase", status: "Active", trigger: "Forth CRM · Outcome = Enrolled", actions: ["Formatter", "Google Ads (OCI)", "Meta CAPI", "Filter"], steps: 6, runs30d: 612, successRate: 97.2, tasksUsed: 3180, lastRun: "3m ago", legacyApi: true },
  { id: "zap_oci_qual", name: "Forth Qualified → Google OCI Qualified", status: "Active", trigger: "Forth CRM · Outcome = Qualified", actions: ["Formatter", "Google Ads (OCI)"], steps: 4, runs30d: 1240, successRate: 98.6, tasksUsed: 4520, lastRun: "1m ago", legacyApi: true },
  { id: "zap_callrail", name: "CallRail Call → Forth Lead + CAPI Lead", status: "Active", trigger: "CallRail · Call Completed", actions: ["Forth CRM", "Meta CAPI", "Filter"], steps: 5, runs30d: 832, successRate: 96.1, tasksUsed: 3460, lastRun: "2m ago", legacyApi: false },
  { id: "zap_leadstamp", name: "Landing Form → event_id mint + Pixel/CAPI Lead", status: "Active", trigger: "Webhooks by Zapier · Catch Hook", actions: ["Code (event_id)", "Meta CAPI", "Storage"], steps: 5, runs30d: 6180, successRate: 99.4, tasksUsed: 28900, lastRun: "8s ago", legacyApi: false },
  { id: "zap_emq_enrich", name: "CAPI Enrichment → fbc/fbp backfill from session", status: "Active", trigger: "Storage by Zapier · Lookup", actions: ["Storage", "Code", "Meta CAPI"], steps: 4, runs30d: 1705, successRate: 98.1, tasksUsed: 6680, lastRun: "1m ago", legacyApi: false },
  { id: "zap_backfill", name: "Meta CAPI Backfill (Schedule)", status: "Paused", trigger: "Schedule · Every 6 hours", actions: ["Storage", "Filter", "Meta CAPI"], steps: 5, runs30d: 96, successRate: 81.0, tasksUsed: 410, lastRun: "5h ago", legacyApi: false },
];

export type ZapRun = {
  id: string;
  zap: string;
  ranAt: string;
  status: "Success" | "Filtered" | "Error" | "Replayed";
  trigger: string;
  destination: string;
  tasks: number;
  durationMs: number;
  failedStep: string | null;
  error: string | null;
};

export const ZAP_RUNS: ZapRun[] = [
  { id: "zr_9a31f7c2", zap: "Forth Enrolled → OCI + CAPI", ranAt: "3:03 PM", status: "Success", trigger: "forth_contact_300214", destination: "Google OCT + Meta", tasks: 6, durationMs: 1840, failedStep: null, error: null },
  { id: "zr_77be1204", zap: "Forth Qualified → OCI", ranAt: "3:01 PM", status: "Success", trigger: "forth_contact_300188", destination: "Google OCT", tasks: 4, durationMs: 1420, failedStep: null, error: null },
  { id: "zr_5c93f1e8", zap: "Forth Enrolled → OCI + CAPI", ranAt: "2:58 PM", status: "Error", trigger: "forth_contact_300173", destination: "Google OCT", tasks: 5, durationMs: 2110, failedStep: "Step 4: Google Ads (OCI)", error: "UNPARSEABLE_GCLID: googleClickId is case-sensitive" },
  { id: "zr_a17e6620", zap: "CallRail Call → Forth + CAPI", ranAt: "2:55 PM", status: "Filtered", trigger: "callrail_call_55021", destination: "—", tasks: 2, durationMs: 640, failedStep: null, error: null },
  { id: "zr_3f82c7aa", zap: "Meta CAPI Backfill", ranAt: "2:51 PM", status: "Error", trigger: "schedule_run", destination: "Meta CAPI", tasks: 3, durationMs: 980, failedStep: "Step 3: Meta CAPI", error: "Invalid OAuth access token for dataset 1184422965537001" },
  { id: "zr_61bb90c4", zap: "Meta CAPI Backfill (replay)", ranAt: "2:51 PM", status: "Replayed", trigger: "schedule_run", destination: "Meta CAPI", tasks: 3, durationMs: 1010, failedStep: null, error: null },
  { id: "zr_0aa7f135", zap: "Landing Form → event_id mint", ranAt: "2:49 PM", status: "Success", trigger: "hook_form_88213", destination: "Meta Pixel + CAPI", tasks: 5, durationMs: 760, failedStep: null, error: null },
  { id: "zr_2b71d04a", zap: "Forth Enrolled → OCI + CAPI", ranAt: "2:47 PM", status: "Success", trigger: "forth_contact_300152", destination: "Google OCT + Meta", tasks: 6, durationMs: 1790, failedStep: null, error: null },
  { id: "zr_d4410ab9", zap: "CallRail Call → Forth + CAPI", ranAt: "2:44 PM", status: "Error", trigger: "callrail_call_55008", destination: "Meta CAPI", tasks: 4, durationMs: 1320, failedStep: "Step 3: Meta CAPI", error: "Invalid hashed phone format — expected E.164 before SHA-256" },
  { id: "zr_8c2290f1", zap: "Forth Qualified → OCI", ranAt: "2:42 PM", status: "Success", trigger: "forth_contact_300131", destination: "Google OCT", tasks: 4, durationMs: 1380, failedStep: null, error: null },
];

export type ZapErrorGroup = {
  type: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  destination: string;
  sample: string;
};

export const ZAP_ERRORS: ZapErrorGroup[] = [
  { type: "UNPARSEABLE_GCLID (Google OCI)", count: 14, firstSeen: "6 days ago", lastSeen: "6m ago", destination: "Google OCT", sample: "googleClickId is case-sensitive — trailing whitespace from CRM field" },
  { type: "Invalid OAuth token (Meta CAPI)", count: 9, firstSeen: "May 15", lastSeen: "13m ago", destination: "Meta CAPI", sample: "Access token expired for dataset 1184422965537001 (Backfill Zap)" },
  { type: "Invalid hashed phone (Meta CAPI)", count: 7, firstSeen: "8 days ago", lastSeen: "20m ago", destination: "Meta CAPI", sample: "Expected E.164 before SHA-256 — value '(415) 555-1234'" },
  { type: "CONVERSION_ALREADY_EXISTS (Google)", count: 5, firstSeen: "4 days ago", lastSeen: "1h ago", destination: "Google OCT", sample: "Backfill re-uploaded gclid + action + timestamp already on file" },
];

/* Webhook inbound stream */
export type WebhookEvent = {
  id: string;
  source: "Forth CRM" | "CallRail";
  type: string;
  receivedAt: string;
  http: number;
  signatureValid: boolean;
  idsPresent: string[];
};

export const WEBHOOKS: WebhookEvent[] = [
  { id: "wh_300214", source: "Forth CRM", type: "Outcome = Enrolled", receivedAt: "3:03:08 PM", http: 200, signatureValid: true, idsPresent: ["gclid", "email", "phone", "event_id"] },
  { id: "wh_55021", source: "CallRail", type: "Call Completed", receivedAt: "2:55:41 PM", http: 200, signatureValid: true, idsPresent: ["gclid", "phone"] },
  { id: "wh_300188", source: "Forth CRM", type: "Outcome = Qualified", receivedAt: "3:01:02 PM", http: 200, signatureValid: true, idsPresent: ["gclid", "email", "phone", "event_id"] },
  { id: "wh_88213", source: "Forth CRM", type: "Form Submit", receivedAt: "2:49:55 PM", http: 200, signatureValid: true, idsPresent: ["fbc", "fbp", "email", "utm", "event_id"] },
  { id: "wh_55008", source: "CallRail", type: "Call Completed", receivedAt: "2:44:17 PM", http: 200, signatureValid: true, idsPresent: ["phone"] },
];

/* ----------------------------------------------------------------------- */
/* Platforms (Google Ads OCT + Meta CAPI)                                  */
/* ----------------------------------------------------------------------- */

export type GoogleAction = {
  action: string;
  uploaded: number;
  accepted: number;
  matched: number; // %
  rejected: number;
  value: number;
  topReject: string;
};

export const GOOGLE_ACTIONS: GoogleAction[] = [
  { action: "Lead — Offline (CRM)", uploaded: 2980, accepted: 2842, matched: 95, rejected: 138, value: 0, topReject: "Unknown gclid" },
  { action: "Qualified — Offline (CRM)", uploaded: 1240, accepted: 1108, matched: 89, rejected: 132, value: 1662000, topReject: "Conversion precedes click" },
  { action: "Enrolled — Offline (CRM)", uploaded: 357, accepted: 298, matched: 83, rejected: 59, value: 1251600, topReject: "Expired gclid (>90d)" },
  { action: "Phone Call — CallRail", uploaded: 408, accepted: 351, matched: 86, rejected: 57, value: 0, topReject: "No gclid captured" },
];

export type MetaEventRow = {
  event: string;
  pixel: number;
  capi: number;
  deduped: number;
  emq: number;
  band: "great" | "good" | "ok" | "poor";
  state: "deduped" | "broken";
};

export const META_EVENTS: MetaEventRow[] = [
  { event: "Lead", pixel: 4120, capi: 4310, deduped: 4080, emq: 7.2, band: "good", state: "deduped" },
  { event: "SubmitApplication", pixel: 1860, capi: 1980, deduped: 1842, emq: 7.6, band: "good", state: "deduped" },
  { event: "Schedule (Qualified)", pixel: 1180, capi: 1262, deduped: 1166, emq: 7.9, band: "good", state: "deduped" },
  { event: "Purchase (Enrolled)", pixel: 372, capi: 372, deduped: 366, emq: 6.8, band: "ok", state: "deduped" },
  { event: "Purchase — Spanish LP", pixel: 0, capi: 88, deduped: 0, emq: 5.1, band: "poor", state: "broken" },
];

/* EMQ contributing key mix for the selected event */
export type EmqKey = { key: string; present: number };
export const EMQ_KEYS: EmqKey[] = [
  { key: "email (em)", present: 98 },
  { key: "phone (ph)", present: 91 },
  { key: "fbp", present: 96 },
  { key: "fbc", present: 73 },
  { key: "external_id", present: 88 },
  { key: "first/last name", present: 84 },
  { key: "city/state/zip", present: 79 },
  { key: "IP + user agent", present: 99 },
];

/* Signal diagnostics: duplicate / missing / misnamed */
export type Diagnostic = {
  id: string;
  kind: "Duplicate" | "Missing" | "Misnamed";
  title: string;
  detail: string;
  affected: number;
  valueAtRisk: number;
};

export const DIAGNOSTICS: Diagnostic[] = [
  { id: "d1", kind: "Duplicate", title: "Purchase double-counted (Meta)", detail: "Backfill Zap re-sent event_id evt_3f82c7aa within window — both kept.", affected: 18, valueAtRisk: 75600 },
  { id: "d2", kind: "Duplicate", title: "CONVERSION_ALREADY_EXISTS (Google)", detail: "gclid + action + timestamp re-uploaded on replay.", affected: 5, valueAtRisk: 21000 },
  { id: "d3", kind: "Missing", title: "Enrolled with no platform event", detail: "58 CRM Enrolled outcomes never posted back — click ID lost upstream.", affected: 58, valueAtRisk: 243600 },
  { id: "d4", kind: "Missing", title: "Qualified not reaching Meta", detail: "CAPI Enrichment Zap held during May 15 auth outage.", affected: 41, valueAtRisk: 0 },
  { id: "d5", kind: "Misnamed", title: "'Purchase' fired where 'Qualified' expected", detail: "Spanish LP maps Qualified → Purchase, inflating Enrolled count.", affected: 88, valueAtRisk: 0 },
  { id: "d6", kind: "Misnamed", title: "event_name casing drift (purchase vs Purchase)", detail: "Browser pixel sends lowercase — dedup fails, both retained.", affected: 12, valueAtRisk: 50400 },
];

/* Coverage reconciliation: CRM truth vs Google vs Meta */
export type Reconciliation = { stage: string; crm: number; google: number; meta: number };
export const RECONCILIATION: Reconciliation[] = [
  { stage: "Lead", crm: 6180, google: 2842, meta: 4080 },
  { stage: "Qualified", crm: 1330, google: 1108, meta: 1166 },
  { stage: "Enrolled", crm: 415, google: 298, meta: 366 },
];

/* ----------------------------------------------------------------------- */
/* Connected sources                                                       */
/* ----------------------------------------------------------------------- */

export type Source = {
  name: string;
  role: string;
  slug: string | null; // simpleicons slug
  icon: string | null; // lucide fallback
  color: string;
  lastSync: string;
};

export const SOURCES: Source[] = [
  { name: "Forth CRM", role: "Outcome stages · source of truth", slug: null, icon: "Database", color: "#0ea5e9", lastSync: "Live" },
  { name: "CallRail", role: "Phone-call tracking", slug: null, icon: "PhoneCall", color: "#f59e0b", lastSync: "3:03 PM" },
  { name: "Zapier", role: "Orchestration · webhooks", slug: "zapier", icon: null, color: "FF4F00", lastSync: "Live" },
  { name: "Google Ads", role: "Offline conversion import", slug: "googleads", icon: null, color: "4285F4", lastSync: "3:04 PM" },
  { name: "Meta", role: "Pixel + Conversions API", slug: "meta", icon: null, color: "0866FF", lastSync: "Live" },
  { name: "Google Tag Manager", role: "Server + web container", slug: "googletagmanager", icon: null, color: "246FDB", lastSync: "3:04 PM" },
  { name: "Google Analytics 4", role: "Cross-check · GA4", slug: "googleanalytics", icon: null, color: "E37400", lastSync: "3:00 PM" },
];
