import {
  ArrowDownRight,
  ArrowUpRight,
  GitBranch,
  Layers,
  Minus,
  ScanSearch,
  TriangleAlert,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StageFunnelChart from "@/components/charts/funnel/StageFunnelChart";
import LagChart from "@/components/charts/funnel/LagChart";
import CampaignValueChart from "@/components/charts/funnel/CampaignValueChart";
import {
  ACCOUNT,
  ATTRIBUTION,
  ATTRIBUTION_BY_IDENTIFIER,
  CAMPAIGNS,
  FUNNEL,
  PLATFORM_COLORS,
  STAGE_MAPPING,
} from "@/lib/data";
import {
  fmtCurrency,
  fmtNumber,
  fmtPercent,
  fmtSignedPercent,
} from "@/lib/format";

/* Simple Icons slug per platform, else null -> colored dot */
const PLATFORM_SLUG: Record<string, string | null> = {
  "Google Ads": "googleads",
  Meta: "meta",
  "CallRail (Phone)": null,
  "Organic / Direct": null,
};

/* Forth CRM full-value per Enrolled outcome (Enrolled stage value / count) */
const ENROLLED_STAGE = FUNNEL.find((s) => s.stage === "Enrolled")!;
const VALUE_PER_ENROLLED = Math.round(ENROLLED_STAGE.value / ENROLLED_STAGE.count);
const UNATTRIBUTABLE = ENROLLED_STAGE.leakage * VALUE_PER_ENROLLED;

/* Per-platform CRM-vs-platform discrepancy (reportable only when platform reports) */
const DISCREPANCIES = ATTRIBUTION.filter((a) => a.platformValue > 0).map((a) => ({
  platform: a.platform,
  crmValue: a.crmValue,
  platformValue: a.platformValue,
  gapPct: ((a.platformValue - a.crmValue) / a.crmValue) * 100,
}));

/* Totals for the attribution table footer */
const TOTALS = ATTRIBUTION.reduce(
  (acc, a) => ({
    leads: acc.leads + a.leads,
    qualified: acc.qualified + a.qualified,
    enrolled: acc.enrolled + a.enrolled,
    crmValue: acc.crmValue + a.crmValue,
    platformValue: acc.platformValue + a.platformValue,
    spend: acc.spend + a.spend,
  }),
  { leads: 0, qualified: 0, enrolled: 0, crmValue: 0, platformValue: 0, spend: 0 },
);

const MAX_ID_VALUE = Math.max(...ATTRIBUTION_BY_IDENTIFIER.map((d) => d.value));

function PlatformMark({ platform }: { platform: string }) {
  const slug = PLATFORM_SLUG[platform];
  if (slug) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://cdn.simpleicons.org/${slug}`}
        alt={platform}
        width={16}
        height={16}
        className="h-4 w-4 shrink-0"
      />
    );
  }
  return (
    <span
      className="h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ background: PLATFORM_COLORS[platform] ?? "#64748b" }}
    />
  );
}

export default function FunnelPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Funnel & Attribution"
        subtitle={`Stage conversion and attributed revenue by platform and identifier · ${ACCOUNT.brand} · ${ACCOUNT.window}`}
      >
        <span className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-surface-muted px-2.5 py-1.5 text-xs font-medium text-muted sm:inline-flex">
          <GitBranch className="h-3.5 w-3.5" />
          Forth CRM source-of-truth
        </span>
      </PageHeader>

      {/* 1 — Stage conversion funnel + stage detail */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Stage Conversion Funnel"
          subtitle="Lead → Underwriting → Qualified → Enrolled · stage CVR and dwell time"
        >
          <StageFunnelChart />
        </Card>

        <Card
          title="Stage Economics"
          subtitle="Volume, CVR, and avg days-in-stage"
          bodyClassName="py-2"
        >
          <ul className="divide-y divide-border/70">
            {FUNNEL.map((s) => (
              <li key={s.stage} className="flex items-center justify-between py-2.5">
                <div>
                  <div className="text-sm font-semibold text-foreground">{s.stage}</div>
                  <div className="text-[11px] text-muted">
                    {s.cvr === null ? "funnel entry" : `${fmtPercent(s.cvr)} from prior`}
                    {s.avgDays > 0 ? ` · ${s.avgDays}d avg` : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums text-foreground">
                    {fmtNumber(s.count)}
                  </div>
                  <div className="text-[11px] tabular-nums text-muted">
                    {s.value > 0 ? `${fmtCurrency(s.value, { compact: true })} value` : "micro-value"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 2 — Attributed revenue by platform: CRM vs platform-reported */}
      <Card
        title="Attributed Revenue by Platform"
        subtitle="CRM source-of-truth vs. platform-reported value — exposes over / under-counting"
        action={
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <ScanSearch className="h-3.5 w-3.5" />
            CPA / ROAS = enrolled
          </span>
        }
        bodyClassName="px-0 py-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 text-left font-medium">Platform</th>
                <th className="px-3 py-3 text-right font-medium">Leads</th>
                <th className="px-3 py-3 text-right font-medium">Qualified</th>
                <th className="px-3 py-3 text-right font-medium">Enrolled</th>
                <th className="px-3 py-3 text-right font-medium">CRM value</th>
                <th className="px-3 py-3 text-right font-medium">Platform-reported</th>
                <th className="px-3 py-3 text-right font-medium">Gap</th>
                <th className="px-3 py-3 text-right font-medium">CPA</th>
                <th className="px-5 py-3 text-right font-medium">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {ATTRIBUTION.map((a) => {
                const reports = a.platformValue > 0;
                const gapPct = reports
                  ? ((a.platformValue - a.crmValue) / a.crmValue) * 100
                  : null;
                return (
                  <tr
                    key={a.platform}
                    className="border-b border-border/70 hover:bg-surface-muted"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <PlatformMark platform={a.platform} />
                        <span className="font-medium text-foreground">{a.platform}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">
                      {fmtNumber(a.leads)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">
                      {fmtNumber(a.qualified)}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums text-foreground">
                      {fmtNumber(a.enrolled)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-foreground">
                      {fmtCurrency(a.crmValue)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">
                      {reports ? fmtCurrency(a.platformValue) : "—"}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {gapPct === null ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <span
                          className={`font-semibold ${
                            gapPct > 10
                              ? "text-rose-600"
                              : gapPct > 0
                                ? "text-amber-600"
                                : "text-emerald-600"
                          }`}
                        >
                          {fmtSignedPercent(gapPct)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-foreground">
                      {a.cpa > 0 ? fmtCurrency(a.cpa) : "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-foreground">
                      {a.roas > 0 ? `${a.roas.toFixed(1)}×` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-border text-xs uppercase tracking-wide text-muted">
                <td className="px-5 py-3 font-medium">Total</td>
                <td className="px-3 py-3 text-right tabular-nums">{fmtNumber(TOTALS.leads)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{fmtNumber(TOTALS.qualified)}</td>
                <td className="px-3 py-3 text-right font-semibold tabular-nums text-foreground">
                  {fmtNumber(TOTALS.enrolled)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-foreground">
                  {fmtCurrency(TOTALS.crmValue)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {fmtCurrency(TOTALS.platformValue)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {fmtSignedPercent(
                    ((TOTALS.platformValue - TOTALS.crmValue) / TOTALS.crmValue) * 100,
                  )}
                </td>
                <td className="px-3 py-3" />
                <td className="px-5 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* 3 — Revenue & conversions by campaign */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          title="Enrolled Value by Campaign"
          subtitle="Grouped by platform · sky = Google, blue = Meta"
        >
          <CampaignValueChart />
        </Card>

        <Card
          title="Campaign Performance"
          subtitle="Enrolled outcomes, value, spend, and CPA"
          bodyClassName="px-0 py-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 text-left font-medium">Campaign</th>
                  <th className="px-3 py-3 text-right font-medium">Enrolled</th>
                  <th className="px-3 py-3 text-right font-medium">Value</th>
                  <th className="px-3 py-3 text-right font-medium">Spend</th>
                  <th className="px-5 py-3 text-right font-medium">CPA</th>
                </tr>
              </thead>
              <tbody>
                {CAMPAIGNS.map((c) => (
                  <tr
                    key={c.name}
                    className="border-b border-border/70 hover:bg-surface-muted"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <PlatformMark platform={c.platform === "Google" ? "Google Ads" : c.platform} />
                        <span className="font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-foreground">
                      {fmtNumber(c.enrolled)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-foreground">
                      {fmtCurrency(c.value, { compact: true })}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">
                      {fmtCurrency(c.spend, { compact: true })}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-foreground">
                      {fmtCurrency(c.cpa)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 4 + 5 — Identifier matrix + cohort lag */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          title="Attribution by Identifier"
          subtitle="Which identifier carries the enrolled-conversion credit"
          action={
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <Layers className="h-3.5 w-3.5" />
              Share of attributed
            </span>
          }
        >
          <ul className="space-y-3">
            {ATTRIBUTION_BY_IDENTIFIER.map((d) => (
              <li key={d.identifier}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-medium text-foreground">
                    {d.identifier}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted">
                    {fmtNumber(d.enrolled)} · {fmtCurrency(d.value, { compact: true })}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${(d.value / MAX_ID_VALUE) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">
                    {fmtPercent(d.share)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Lead → Enrolled Lag (Cohort)"
          subtitle="gclid expires at 90d · Meta click window 7d — the 90d+ tail is unrecoverable"
          action={
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#1a73e8" }} /> Google
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#0866ff" }} /> Meta
              </span>
            </div>
          }
        >
          <LagChart />
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
            <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
            22 enrolled conversions land past the 90-day click window — recover via Enhanced
            Conversions for Leads (email + phone) fallback.
          </p>
        </Card>
      </div>

      {/* 6 + 7 — Stage→value→platform mapping + discrepancy callouts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Stage → Value → Platform Mapping"
          subtitle="Proves value-based bidding is fed the correct conversion action and event per stage"
          bodyClassName="px-0 py-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 text-left font-medium">Stage</th>
                  <th className="px-3 py-3 text-left font-medium">Conversion value</th>
                  <th className="px-3 py-3 text-left font-medium">Google Ads action</th>
                  <th className="px-5 py-3 text-left font-medium">Meta event</th>
                </tr>
              </thead>
              <tbody>
                {STAGE_MAPPING.map((m) => (
                  <tr
                    key={m.stage}
                    className="border-b border-border/70 hover:bg-surface-muted"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">{m.stage}</td>
                    <td className="px-3 py-3 tabular-nums text-foreground">{m.value}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-2 text-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://cdn.simpleicons.org/googleads"
                          alt="Google Ads"
                          width={14}
                          height={14}
                          className="h-3.5 w-3.5"
                        />
                        {m.googleAction}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-2 text-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://cdn.simpleicons.org/meta"
                          alt="Meta"
                          width={14}
                          height={14}
                          className="h-3.5 w-3.5"
                        />
                        {m.metaEvent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Discrepancy & Leakage"
          subtitle="Platform-reported vs. CRM truth"
        >
          <div className="space-y-3">
            <div className="rounded-lg bg-rose-50 p-4">
              <div className="text-xs font-medium text-rose-700">
                Unattributable enrolled revenue
              </div>
              <div className="mt-0.5 text-2xl font-bold tabular-nums text-rose-700">
                {fmtCurrency(UNATTRIBUTABLE, { compact: true })}
              </div>
              <div className="text-[11px] text-rose-600/80">
                {ENROLLED_STAGE.leakage} Enrolled outcomes never posted back ·{" "}
                {fmtCurrency(VALUE_PER_ENROLLED)} each
              </div>
            </div>

            <ul className="space-y-2">
              {DISCREPANCIES.map((d) => {
                const over = d.gapPct >= 0;
                const tone =
                  d.gapPct > 10
                    ? "text-rose-600"
                    : over
                      ? "text-amber-600"
                      : "text-emerald-600";
                const Icon = over ? ArrowUpRight : ArrowDownRight;
                return (
                  <li
                    key={d.platform}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-muted px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <PlatformMark platform={d.platform} />
                      <span className="text-sm font-medium text-foreground">
                        {d.platform}
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums ${tone}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {fmtSignedPercent(d.gapPct)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="flex items-start gap-2 text-[11px] text-muted">
              <Minus className="mt-px h-3.5 w-3.5 shrink-0" />
              CallRail and Organic are CRM-only — no platform-reported value to reconcile
              against.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
