import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Copy,
  HelpCircle,
  Tag,
  PhoneCall,
  Globe,
  Webhook,
  ShieldCheck,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import EmqBars from "@/components/charts/platforms/EmqBars";
import ReconciliationChart from "@/components/charts/platforms/ReconciliationChart";
import {
  ACCOUNT,
  GOOGLE_ACTIONS,
  META_EVENTS,
  EMQ_KEYS,
  DIAGNOSTICS,
  RECONCILIATION,
  type Diagnostic,
  type MetaEventRow,
} from "@/lib/data";
import { fmtCurrency, fmtNumber, fmtPercent } from "@/lib/format";

/* ----------------------------------------------------------------------- */
/* Page-local presentational constants (demo)                              */
/* ----------------------------------------------------------------------- */

// EMQ band → chip styling. Mirrors Meta's Event Match Quality 1-10 bands.
const EMQ_BAND: Record<MetaEventRow["band"], { label: string; chip: string }> = {
  great: { label: "Great", chip: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  good: { label: "Good", chip: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  ok: { label: "Needs work", chip: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  poor: { label: "Poor", chip: "bg-rose-50 text-rose-700 ring-rose-600/20" },
};

// action_source contract: every event source has an expected Meta/Google
// action_source. A drift here silently degrades match quality, so we audit it.
type SourceRoute = {
  source: string;
  slug: string | null;
  icon: "PhoneCall" | "Webhook" | "Globe";
  event: string;
  expected: string;
  actual: string;
  match: boolean;
  note: string;
};

const SOURCE_ROUTING: SourceRoute[] = [
  {
    source: "CallRail",
    slug: null,
    icon: "PhoneCall",
    event: "Lead",
    expected: "phone_call",
    actual: "phone_call",
    match: true,
    note: "Call Completed webhook tagged as offline phone conversion.",
  },
  {
    source: "Forth CRM webhook",
    slug: null,
    icon: "Webhook",
    event: "Purchase (Enrolled)",
    expected: "system_generated",
    actual: "system_generated",
    match: true,
    note: "Outcome = Enrolled posts CAPI with no browser context.",
  },
  {
    source: "Web lead form",
    slug: null,
    icon: "Globe",
    event: "Lead",
    expected: "website",
    actual: "website",
    match: true,
    note: "Pixel + CAPI paired on event_id from the landing page.",
  },
  {
    source: "Spanish LP form",
    slug: null,
    icon: "Globe",
    event: "Purchase — Spanish LP",
    expected: "website",
    actual: "system_generated",
    match: false,
    note: "Browser pixel never fires — CAPI marks it system_generated, dedup breaks.",
  },
];

// Dataset / ad-account binding check for Meta. ACCOUNT.metaDataset is the
// dataset the Command Center is wired to; the platform binding must agree.
const DATASET_BINDING = {
  dataset: ACCOUNT.metaDataset,
  adAccountDataset: ACCOUNT.metaDataset,
  adAccount: "act_770154892",
  business: "Brightpath Financial LLC",
};

const ROUTE_ICONS = { PhoneCall, Webhook, Globe } as const;

/* ----------------------------------------------------------------------- */

function emqHintForLowest() {
  const lowest = EMQ_KEYS.reduce((a, b) => (b.present < a.present ? b : a));
  return lowest;
}

function matchColor(pct: number): string {
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 85) return "bg-amber-500";
  return "bg-rose-500";
}

function DiagnosticColumn({
  kind,
  items,
}: {
  kind: Diagnostic["kind"];
  items: Diagnostic[];
}) {
  const totalAtRisk = items.reduce((s, d) => s + d.valueAtRisk, 0);
  const totalAffected = items.reduce((s, d) => s + d.affected, 0);
  const accent =
    kind === "Duplicate"
      ? { icon: Copy, tint: "text-rose-600" }
      : kind === "Missing"
        ? { icon: HelpCircle, tint: "text-rose-600" }
        : { icon: Tag, tint: "text-amber-600" };
  const Icon = accent.icon;

  return (
    <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${accent.tint}`} />
          <h4 className="text-sm font-semibold text-foreground">{kind}</h4>
        </div>
        <span className="text-xs text-muted">
          {fmtNumber(totalAffected)} affected
        </span>
      </div>
      <div className="mt-1 text-xs text-muted">
        {totalAtRisk > 0 ? (
          <>
            <span className="font-semibold text-rose-600">
              {fmtCurrency(totalAtRisk, { compact: true })}
            </span>{" "}
            value at risk
          </>
        ) : (
          "No direct value at risk"
        )}
      </div>
      <div className="mt-3 space-y-3">
        {items.map((d) => (
          <div
            key={d.id}
            className="rounded-lg border border-border bg-surface p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium leading-tight text-foreground">
                {d.title}
              </p>
              {kind === "Misnamed" ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  Misnamed
                </span>
              ) : (
                <span className="shrink-0">
                  <StatusBadge status={kind} />
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">{d.detail}</p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted">
                {fmtNumber(d.affected)} affected
              </span>
              <span
                className={
                  d.valueAtRisk > 0
                    ? "font-semibold tabular-nums text-rose-600"
                    : "tabular-nums text-muted"
                }
              >
                {d.valueAtRisk > 0 ? fmtCurrency(d.valueAtRisk) : "—"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlatformsPage() {
  const lowestEmqKey = emqHintForLowest();

  const duplicates = DIAGNOSTICS.filter((d) => d.kind === "Duplicate");
  const missing = DIAGNOSTICS.filter((d) => d.kind === "Missing");
  const misnamed = DIAGNOSTICS.filter((d) => d.kind === "Misnamed");

  // Derived Google OCT totals
  const gUploaded = GOOGLE_ACTIONS.reduce((s, a) => s + a.uploaded, 0);
  const gAccepted = GOOGLE_ACTIONS.reduce((s, a) => s + a.accepted, 0);
  const gRejected = GOOGLE_ACTIONS.reduce((s, a) => s + a.rejected, 0);
  const gValue = GOOGLE_ACTIONS.reduce((s, a) => s + a.value, 0);
  const gAcceptRate = (gAccepted / gUploaded) * 100;

  // Meta dedup totals
  const metaDeduped = META_EVENTS.reduce((s, e) => s + e.deduped, 0);
  const brokenEvents = META_EVENTS.filter((e) => e.state === "broken").length;

  const routingMismatches = SOURCE_ROUTING.filter((r) => !r.match).length;
  const datasetMatches = DATASET_BINDING.dataset === DATASET_BINDING.adAccountDataset;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Platforms"
        subtitle={`Google Ads OCT + Meta CAPI / Events Manager diagnostics · ${ACCOUNT.window}`}
      >
        <span className="hidden items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted sm:inline-flex">
          Customer {ACCOUNT.googleCustomer} · Dataset ••
          {ACCOUNT.metaDataset.slice(-4)}
        </span>
      </PageHeader>

      {/* 1. Google Ads OCT status */}
      <Card
        title="Google Ads — Offline Conversion Import"
        subtitle="Per conversion action: uploaded vs. accepted, match rate, rejects & value imported"
        action={
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.simpleicons.org/googleads"
              alt="Google Ads"
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
            />
            <span className="text-xs font-medium text-muted">
              {fmtPercent(gAcceptRate)} accepted · {fmtCurrency(gValue, { compact: true })} imported
            </span>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-3 py-2 text-left font-medium">Conversion action</th>
                <th className="px-3 py-2 text-right font-medium">Uploaded</th>
                <th className="px-3 py-2 text-right font-medium">Accepted</th>
                <th className="px-3 py-2 text-left font-medium">Match rate</th>
                <th className="px-3 py-2 text-right font-medium">Rejected</th>
                <th className="px-3 py-2 text-left font-medium">Top reject reason</th>
                <th className="px-3 py-2 text-right font-medium">Value imported</th>
              </tr>
            </thead>
            <tbody>
              {GOOGLE_ACTIONS.map((a) => (
                <tr
                  key={a.action}
                  className="border-b border-border/70 hover:bg-surface-muted"
                >
                  <td className="px-3 py-3 font-medium text-foreground">{a.action}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted">
                    {fmtNumber(a.uploaded)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums font-semibold text-foreground">
                    {fmtNumber(a.accepted)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
                        <div
                          className={`h-full rounded-full ${matchColor(a.matched)}`}
                          style={{ width: `${a.matched}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-xs font-semibold tabular-nums text-foreground">
                        {fmtPercent(a.matched, 0)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-rose-600">
                    {fmtNumber(a.rejected)}
                  </td>
                  <td className="px-3 py-3 text-xs text-muted">{a.topReject}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-foreground">
                    {a.value > 0 ? fmtCurrency(a.value, { compact: true }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="text-xs uppercase tracking-wide text-muted">
                <td className="px-3 pt-3 font-medium">Total</td>
                <td className="px-3 pt-3 text-right tabular-nums">{fmtNumber(gUploaded)}</td>
                <td className="px-3 pt-3 text-right tabular-nums">{fmtNumber(gAccepted)}</td>
                <td className="px-3 pt-3" />
                <td className="px-3 pt-3 text-right tabular-nums text-rose-600">
                  {fmtNumber(gRejected)}
                </td>
                <td className="px-3 pt-3" />
                <td className="px-3 pt-3 text-right tabular-nums">
                  {fmtCurrency(gValue, { compact: true })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* 2 + 3. Meta dedup matrix + EMQ breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Meta — CAPI ↔ Pixel Dedup Matrix"
          subtitle="Per event: pixel / CAPI / deduped counts, EMQ band, and dedup integrity"
          action={
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://cdn.simpleicons.org/meta"
                alt="Meta"
                width={18}
                height={18}
                className="h-[18px] w-[18px]"
              />
              <span className="text-xs font-medium text-muted">
                {fmtNumber(metaDeduped, { compact: true })} deduped
                {brokenEvents > 0 ? ` · ${brokenEvents} broken` : ""}
              </span>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="px-3 py-2 text-left font-medium">Event</th>
                  <th className="px-3 py-2 text-right font-medium">Pixel</th>
                  <th className="px-3 py-2 text-right font-medium">CAPI</th>
                  <th className="px-3 py-2 text-right font-medium">Deduped</th>
                  <th className="px-3 py-2 text-center font-medium">EMQ</th>
                  <th className="px-3 py-2 text-left font-medium">Dedup integrity</th>
                </tr>
              </thead>
              <tbody>
                {META_EVENTS.map((e) => {
                  const band = EMQ_BAND[e.band];
                  return (
                    <tr
                      key={e.event}
                      className="border-b border-border/70 hover:bg-surface-muted"
                    >
                      <td className="px-3 py-3 font-medium text-foreground">{e.event}</td>
                      <td className="px-3 py-3 text-right tabular-nums text-muted">
                        {e.pixel > 0 ? fmtNumber(e.pixel) : "—"}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-muted">
                        {fmtNumber(e.capi)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums font-semibold text-foreground">
                        {e.deduped > 0 ? fmtNumber(e.deduped) : "—"}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${band.chip}`}
                          >
                            {e.emq.toFixed(1)}
                            <span className="font-normal opacity-80">{band.label}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        {e.state === "deduped" ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            1 event · 2 sources
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            1 source — dedup broken
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-xs text-muted">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
            <span>
              Dedup keys on{" "}
              <code className="rounded bg-surface-muted px-1 py-0.5 text-[11px] text-foreground">
                event_name + event_id
              </code>
              . The Spanish LP fires CAPI only — no browser pixel to pair against,
              so the Purchase is counted from a single source.
            </span>
          </p>
        </Card>

        <Card
          title="EMQ Breakdown — Lead"
          subtitle="Per-parameter match coverage feeding Event Match Quality"
        >
          <EmqBars />
          <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <span className="font-semibold">Add {lowestEmqKey.key}</span> — only{" "}
            {fmtPercent(lowestEmqKey.present, 0)} present. Backfilling it from the
            session store is the single biggest EMQ lever on this event.
          </div>
        </Card>
      </div>

      {/* 4. Signal diagnostics: Duplicate / Missing / Misnamed */}
      <Card
        title="Signal Diagnostics"
        subtitle="Duplicate, missing, and misnamed events across Google OCT and Meta CAPI"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <DiagnosticColumn kind="Duplicate" items={duplicates} />
          <DiagnosticColumn kind="Missing" items={missing} />
          <DiagnosticColumn kind="Misnamed" items={misnamed} />
        </div>
      </Card>

      {/* 5. Coverage reconciliation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Coverage Reconciliation"
          subtitle="Forth CRM (source of truth) vs. Google accepted vs. Meta deduped, per stage"
          action={
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-500" /> CRM
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8]" /> Google
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0866ff]" /> Meta
              </span>
            </div>
          }
        >
          <ReconciliationChart />
        </Card>

        <Card title="Signal Coverage %" subtitle="Platform-accepted ÷ CRM truth">
          <div className="space-y-3">
            {RECONCILIATION.map((r) => {
              const g = (r.google / r.crm) * 100;
              const m = (r.meta / r.crm) * 100;
              return (
                <div
                  key={r.stage}
                  className="rounded-lg border border-border bg-surface-muted/40 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{r.stage}</span>
                    <span className="text-xs text-muted">
                      CRM {fmtNumber(r.crm, { compact: true })}
                    </span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <CoverageBar label="Google" pct={g} color="#1a73e8" />
                    <CoverageBar label="Meta" pct={m} color="#0866ff" />
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-muted">
              Enrolled coverage is the weak point — Google sees{" "}
              {fmtPercent(
                (RECONCILIATION[2].google / RECONCILIATION[2].crm) * 100,
                0,
              )}{" "}
              of CRM truth as expired click IDs age out of the 90-day window.
            </p>
          </div>
        </Card>
      </div>

      {/* 6. action_source & dataset routing audit */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="action_source Routing Audit"
          subtitle="Expected vs. actual action_source per event source"
          action={
            routingMismatches > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
                <AlertTriangle className="h-3.5 w-3.5" />
                {routingMismatches} mismatch
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All aligned
              </span>
            )
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="px-3 py-2 text-left font-medium">Source</th>
                  <th className="px-3 py-2 text-left font-medium">Event</th>
                  <th className="px-3 py-2 text-left font-medium">Expected</th>
                  <th className="px-3 py-2 text-left font-medium">Actual</th>
                  <th className="px-3 py-2 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {SOURCE_ROUTING.map((r) => {
                  const Icon = ROUTE_ICONS[r.icon];
                  return (
                    <tr
                      key={r.source}
                      className="border-b border-border/70 hover:bg-surface-muted"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                            <Icon className="h-3.5 w-3.5 text-slate-500" />
                          </span>
                          <div>
                            <div className="font-medium text-foreground">{r.source}</div>
                            <div className="text-[11px] text-muted">{r.note}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted">{r.event}</td>
                      <td className="px-3 py-3">
                        <code className="rounded bg-surface-muted px-1.5 py-0.5 text-[11px] text-foreground">
                          {r.expected}
                        </code>
                      </td>
                      <td className="px-3 py-3">
                        <code
                          className={`rounded px-1.5 py-0.5 text-[11px] ${
                            r.match
                              ? "bg-surface-muted text-foreground"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {r.actual}
                        </code>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-center">
                          {r.match ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-600" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Dataset Routing Check"
          subtitle="Active dataset vs. ad-account binding"
        >
          <div className="space-y-3">
            <div
              className={`rounded-lg p-4 ${
                datasetMatches ? "bg-emerald-50" : "bg-rose-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {datasetMatches ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-700" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    datasetMatches ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {datasetMatches ? "Binding verified" : "Binding mismatch"}
                </span>
              </div>
              <p
                className={`mt-1 text-xs ${
                  datasetMatches ? "text-emerald-700/80" : "text-rose-700/80"
                }`}
              >
                Active dataset matches the dataset bound to the Meta ad account.
              </p>
            </div>

            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted">Active dataset</dt>
                <dd className="flex items-center gap-1.5 font-medium tabular-nums text-foreground">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://cdn.simpleicons.org/meta"
                    alt="Meta"
                    width={14}
                    height={14}
                    className="h-3.5 w-3.5"
                  />
                  {DATASET_BINDING.dataset}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted">Ad-account binding</dt>
                <dd className="flex items-center gap-1.5 font-medium tabular-nums text-foreground">
                  {DATASET_BINDING.adAccountDataset}
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
                <dt className="text-muted">Ad account</dt>
                <dd className="font-medium tabular-nums text-foreground">
                  {DATASET_BINDING.adAccount}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted">Business</dt>
                <dd className="font-medium text-foreground">
                  {DATASET_BINDING.business}
                </dd>
              </div>
            </dl>

            <div className="flex items-center gap-1.5 rounded-lg bg-surface-muted px-3 py-2 text-[11px] text-muted">
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              CAPI payloads route to dataset ••{DATASET_BINDING.dataset.slice(-4)} —
              the only dataset attached to {DATASET_BINDING.adAccount}.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CoverageBar({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  const tone =
    pct >= 90 ? "text-emerald-600" : pct >= 75 ? "text-amber-600" : "text-rose-600";
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 shrink-0 text-xs text-muted">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }}
        />
      </div>
      <span className={`w-10 text-right text-xs font-semibold tabular-nums ${tone}`}>
        {fmtPercent(pct, 0)}
      </span>
    </div>
  );
}
