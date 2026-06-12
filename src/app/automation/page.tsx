import {
  AlertTriangle,
  ArrowRight,
  Webhook,
  Workflow,
  Zap as ZapIcon,
  Clock,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Bug,
  Server,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import ThroughputChart from "@/components/charts/automation/ThroughputChart";
import {
  ZAPS,
  ZAP_RUNS,
  WEBHOOKS,
  ZAP_ERRORS,
  DAILY,
  ACCOUNT,
} from "@/lib/data";
import { fmtNumber, fmtPercent } from "@/lib/format";

/* ----------------------------------------------------------------------- */
/* Page-local presentational constants (demo only — not in the data layer) */
/* ----------------------------------------------------------------------- */

// Monthly Zapier task plan, used to render "tasks used vs implied allowance".
// Tuned to a Team plan tier for a high-volume OCT pipeline.
const TASK_PLAN = {
  tier: "Team · 100k tasks/mo",
  included: 100_000,
};

// Which action apps map to a brand logo on the Simple Icons CDN.
const ACTION_SLUG: Record<string, string> = {
  "Google Ads (OCI)": "googleads",
  "Meta CAPI": "meta",
  "Forth CRM": "googleanalytics", // no Forth brand logo; lucide dot used instead
};

const ACTION_LOGO: Record<string, string> = {
  "Google Ads (OCI)": "googleads",
  "Meta CAPI": "meta",
};

function successTone(rate: number): string {
  if (rate >= 99) return "text-emerald-600";
  if (rate >= 95) return "text-amber-600";
  return "text-rose-600";
}

function successBg(rate: number): string {
  if (rate >= 99) return "bg-emerald-500";
  if (rate >= 95) return "bg-amber-500";
  return "bg-rose-500";
}

export default function AutomationPage() {
  const legacyZaps = ZAPS.filter((z) => z.legacyApi);
  const totalTasks = ZAPS.reduce((sum, z) => sum + z.tasksUsed, 0);
  const totalRuns = ZAPS.reduce((sum, z) => sum + z.runs30d, 0);
  const totalErrors = ZAP_ERRORS.reduce((sum, e) => sum + e.count, 0);
  const monthErrors = DAILY.reduce((sum, d) => sum + d.zapErrors, 0);
  const blendedSuccess =
    totalRuns > 0
      ? (ZAPS.reduce((sum, z) => sum + (z.successRate / 100) * z.runs30d, 0) /
          totalRuns) *
        100
      : 0;
  const taskPct = (totalTasks / TASK_PLAN.included) * 100;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Zapier & Webhooks"
        subtitle={`Pipeline monitor & error diagnostics · ${ACCOUNT.brand} · ${ACCOUNT.window}`}
      >
        <span className="hidden items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted sm:inline-flex">
          <Workflow className="h-3.5 w-3.5" />
          {fmtNumber(totalRuns)} runs · 30d
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
          <ZapIcon className="h-3.5 w-3.5" />
          {fmtPercent(blendedSuccess)} success
        </span>
      </PageHeader>

      {/* 1 — Migration readiness banner */}
      <div className="overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-amber-50/70 to-indigo-50 shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 ring-1 ring-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">
                  Google Ads Data Manager API cutover — June 15, 2026
                </h2>
                <span className="rounded-full bg-amber-200/70 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                  4 days left
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-amber-900/80">
                The legacy Google Ads API offline-conversion upload endpoint is
                deprecated. {legacyZaps.length} Zap
                {legacyZaps.length === 1 ? "" : "s"} still post enrolled and
                qualified outcomes through the legacy <code className="rounded bg-white/60 px-1 py-0.5 text-[11px] text-amber-900">ConversionUploadService</code>{" "}
                path. Re-auth each to the new Data Manager connection before the
                cutover or offline imports will silently stop matching.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {legacyZaps.map((z) => (
                  <span
                    key={z.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white/70 px-2.5 py-1 text-xs font-medium text-amber-900"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {z.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-[var(--ink)] px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Migration checklist
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Active Zaps",
            value: `${ZAPS.filter((z) => z.status === "Active").length} / ${ZAPS.length}`,
            note: `${ZAPS.filter((z) => z.status === "Paused").length} paused`,
            icon: Workflow,
            tone: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Tasks used · 30d",
            value: fmtNumber(totalTasks, { compact: true }),
            note: `${fmtPercent(taskPct)} of ${TASK_PLAN.tier}`,
            icon: ZapIcon,
            tone: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            label: "Errors · 30d",
            value: fmtNumber(monthErrors),
            note: `${totalErrors} open across ${ZAP_ERRORS.length} groups`,
            icon: Bug,
            tone: "text-rose-600",
            bg: "bg-rose-50",
          },
          {
            label: "Legacy API Zaps",
            value: String(legacyZaps.length),
            note: "migrate by Jun 15",
            icon: AlertTriangle,
            tone: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-surface p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">{s.label}</span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${s.bg} ${s.tone}`}
              >
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {s.value}
            </div>
            <div className="mt-0.5 text-[11px] text-muted">{s.note}</div>
          </div>
        ))}
      </div>

      {/* 2 — Zap monitor board */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Zap Monitor</h3>
          <span className="text-xs text-muted">
            Trigger → actions · success & task volume · last 30 days
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {ZAPS.map((z) => {
            const impliedTasks = z.runs30d * z.steps;
            return (
              <div
                key={z.id}
                className="flex flex-col rounded-xl border border-border bg-surface p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={z.status} />
                    {z.legacyApi && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        <AlertTriangle className="h-3 w-3" />
                        Legacy API
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums ${successTone(z.successRate)}`}
                  >
                    {fmtPercent(z.successRate)}
                  </span>
                </div>

                <h4 className="mt-3 text-sm font-semibold leading-snug text-foreground">
                  {z.name}
                </h4>

                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
                  <ZapIcon className="h-3 w-3 text-violet-500" />
                  <span className="truncate">{z.trigger}</span>
                </div>

                {/* success bar */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className={`h-full rounded-full ${successBg(z.successRate)}`}
                    style={{ width: `${z.successRate}%` }}
                  />
                </div>

                {/* action chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {z.actions.map((a) => {
                    const logo = ACTION_LOGO[a];
                    const slug = ACTION_SLUG[a];
                    return (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-muted px-2 py-1 text-[11px] font-medium text-foreground"
                      >
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://cdn.simpleicons.org/${logo}`}
                            alt={a}
                            width={12}
                            height={12}
                            className="h-3 w-3"
                          />
                        ) : (
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              background: slug ? "#64748b" : "#6366f1",
                            }}
                          />
                        )}
                        {a}
                      </span>
                    );
                  })}
                </div>

                {/* footer metrics */}
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/70 pt-3 text-center">
                  <div>
                    <div className="text-sm font-semibold tabular-nums text-foreground">
                      {fmtNumber(z.runs30d)}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-muted">
                      Runs
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold tabular-nums text-foreground">
                      {fmtNumber(z.tasksUsed, { compact: true })}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-muted">
                      of {fmtNumber(impliedTasks, { compact: true })} tasks
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-sm font-semibold tabular-nums text-foreground">
                      <Clock className="h-3 w-3 text-muted" />
                      {z.lastRun}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-muted">
                      Last run
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 — Throughput trend + 6 error diagnostics side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Pipeline Throughput & Error Rate"
          subtitle="Daily events sent vs. Zap error rate · 30 days"
          action={
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Events
                sent
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Error
                rate
              </span>
            </div>
          }
        >
          <ThroughputChart />
          <p className="mt-2 text-[11px] text-muted">
            The May 15 spike (31 errors) traces to an expired Meta CAPI OAuth
            token on the Backfill Zap — recovered same day via replay; throughput
            dipped on the following weekend cycle.
          </p>
        </Card>

        {/* 6 — Error & failure diagnostics */}
        <Card
          title="Error & Failure Diagnostics"
          subtitle={`${totalErrors} occurrences · grouped by type`}
          bodyClassName="py-3"
        >
          <ul className="space-y-3">
            {ZAP_ERRORS.map((e) => (
              <li
                key={e.type}
                className="rounded-lg border border-border bg-surface-muted/60 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-600">
                      <Bug className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs font-semibold leading-tight text-foreground">
                      {e.type}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold tabular-nums text-rose-700">
                    {e.count}×
                  </span>
                </div>
                <p className="mt-1.5 font-mono text-[11px] leading-snug text-rose-700/90">
                  {e.sample}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Server className="h-3 w-3" />
                    {e.destination}
                  </span>
                  <span>
                    {e.firstSeen} → {e.lastSeen}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 4 — Task history table */}
      <Card
        title="Task History"
        subtitle="Most recent Zap runs across the pipeline"
        bodyClassName="px-0 py-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 text-left font-medium">Run ID</th>
                <th className="px-5 py-3 text-left font-medium">Zap</th>
                <th className="px-5 py-3 text-left font-medium">Trigger</th>
                <th className="px-5 py-3 text-left font-medium">Destination</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Tasks</th>
                <th className="px-5 py-3 text-right font-medium">Duration</th>
                <th className="px-5 py-3 text-right font-medium">Ran</th>
              </tr>
            </thead>
            <tbody>
              {ZAP_RUNS.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border/70 hover:bg-surface-muted"
                >
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs text-foreground">
                      {r.id}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-foreground">{r.zap}</span>
                    {r.error && (
                      <div className="mt-0.5 flex items-start gap-1 text-[11px] text-rose-600">
                        <XCircle className="mt-0.5 h-3 w-3 shrink-0" />
                        <span className="font-mono">
                          {r.failedStep ? `${r.failedStep} · ` : ""}
                          {r.error}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs text-muted">
                      {r.trigger}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{r.destination}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-foreground">
                    {r.tasks}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted">
                    {fmtNumber(r.durationMs)} ms
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted">
                    {r.ranAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5 — Webhook inbound stream */}
      <Card
        title="Inbound Webhook Stream"
        subtitle="Catch-hook deliveries from Forth CRM & CallRail · HTTP + signature + identifiers"
        bodyClassName="px-0 py-0"
        action={
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
            <Webhook className="h-3.5 w-3.5" />
            {WEBHOOKS.length} recent
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 text-left font-medium">Hook ID</th>
                <th className="px-5 py-3 text-left font-medium">Source</th>
                <th className="px-5 py-3 text-left font-medium">Type</th>
                <th className="px-5 py-3 text-center font-medium">HTTP</th>
                <th className="px-5 py-3 text-center font-medium">Signature</th>
                <th className="px-5 py-3 text-left font-medium">
                  Identifiers present
                </th>
                <th className="px-5 py-3 text-right font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {WEBHOOKS.map((w) => (
                <tr
                  key={w.id}
                  className="border-b border-border/70 hover:bg-surface-muted"
                >
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs text-foreground">
                      {w.id}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-foreground">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background:
                            w.source === "CallRail" ? "#f59e0b" : "#0ea5e9",
                        }}
                      />
                      {w.source}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{w.type}</td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                        w.http === 200
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {w.http}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-center">
                      {w.signatureValid ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          Invalid
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {w.idsPresent.map((id) => (
                        <span
                          key={id}
                          className="rounded border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground"
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted">
                    {w.receivedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 border-t border-border px-5 py-3 text-[11px] text-muted">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          All inbound hooks returned HTTP 200 with a valid HMAC signature in the
          last window. Identifiers are forwarded to the event_id mint and CAPI
          enrichment Zaps.
        </div>
      </Card>
    </div>
  );
}
