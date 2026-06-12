import { Fingerprint, Radio, ShieldAlert, Wrench } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import Sparkline from "@/components/charts/Sparkline";
import HopWaterfall from "@/components/charts/identifiers/HopWaterfall";
import CaptureTrend from "@/components/charts/identifiers/CaptureTrend";
import {
  ACCOUNT,
  IDENTIFIER_RATES,
  COVERAGE,
  PII_HYGIENE,
  LEAK_PATTERNS,
  PALETTE,
  type IdentifierRate,
  type CoverageRow,
} from "@/lib/data";
import { fmtNumber, fmtPercent, fmtSignedPercent } from "@/lib/format";

/* ----------------------------------------------------------------------- */
/* Page-local presentational helpers                                       */
/* ----------------------------------------------------------------------- */

type RateTone = "good" | "watch" | "bad";

// capture >= target → good; within 5 pts below → watch; else → bad
function rateTone(r: IdentifierRate): RateTone {
  if (r.capture >= r.target) return "good";
  if (r.target - r.capture <= 5) return "watch";
  return "bad";
}

const RATE_TONE_TEXT: Record<RateTone, string> = {
  good: "text-emerald-600",
  watch: "text-amber-600",
  bad: "text-rose-600",
};
const RATE_TONE_BAR: Record<RateTone, string> = {
  good: "bg-emerald-500",
  watch: "bg-amber-500",
  bad: "bg-rose-500",
};
const RATE_TONE_SPARK: Record<RateTone, string> = {
  good: PALETTE.emerald,
  watch: PALETTE.amber,
  bad: PALETTE.rose,
};
const RATE_TONE_LABEL: Record<RateTone, string> = {
  good: "At / above target",
  watch: "Within 5 pts",
  bad: "Below target",
};

// Map COVERAGE.health → StatusBadge-supported status (Watch → Warning).
const HEALTH_BADGE: Record<CoverageRow["health"], string> = {
  Healthy: "Healthy",
  Watch: "Warning",
  Critical: "Critical",
};

// Color a per-key coverage % cell. A "—" is rendered when the key is N/A.
function coverageCellClass(v: number): string {
  if (v === 0) return "text-slate-300";
  if (v >= 85) return "text-emerald-600";
  if (v >= 65) return "text-amber-600";
  return "text-rose-600";
}

const PII_WARN_THRESHOLD = 98;

const COVERAGE_KEYS: { key: keyof CoverageRow; label: string }[] = [
  { key: "gclid", label: "gclid" },
  { key: "fbc", label: "fbc" },
  { key: "fbp", label: "fbp" },
  { key: "email", label: "email" },
  { key: "phone", label: "phone" },
  { key: "fullMatchKey", label: "Full match key" },
];

const SOURCE_DOT: Record<string, string> = {
  Google: PALETTE.google,
  Meta: PALETTE.meta,
  CallRail: PALETTE.violet,
};

/* ----------------------------------------------------------------------- */
/* Derived summary numbers (from data exports only)                        */
/* ----------------------------------------------------------------------- */

const belowTarget = IDENTIFIER_RATES.filter((r) => r.capture < r.target);
const clickIds = IDENTIFIER_RATES.filter((r) =>
  ["gclid", "gbraid", "wbraid", "fbclid", "fbc"].includes(r.id)
);
const clickIdAvg = Math.round(
  clickIds.reduce((s, r) => s + r.capture, 0) / clickIds.length
);
const leakTotal = LEAK_PATTERNS.reduce((s, l) => s + l.affected, 0);
const piiBelow = PII_HYGIENE.filter((p) => p.conforming < PII_WARN_THRESHOLD).length;

export default function IdentifiersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Identifier Capture Health"
        subtitle={`Where signals drop across hops · ${ACCOUNT.brand} · ${ACCOUNT.window}`}
      >
        <span className="hidden items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 sm:inline-flex">
          <Radio className="h-3.5 w-3.5" />
          Demo data
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground">
          <Fingerprint className="h-4 w-4 text-indigo-500" />
          {belowTarget.length} of {IDENTIFIER_RATES.length} below target
        </span>
      </PageHeader>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <div className="text-xs font-medium text-muted">Blended click-ID capture</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-foreground">
            {fmtPercent(clickIdAvg, 0)}
          </div>
          <div className="text-[11px] text-slate-400">
            gclid / braid / fbclid / fbc · target 85%+
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <div className="text-xs font-medium text-muted">Identifiers below target</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-amber-600">
            {belowTarget.length}
          </div>
          <div className="text-[11px] text-slate-400">
            {belowTarget.map((r) => r.label).join(", ")}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <div className="text-xs font-medium text-muted">PII checks under {PII_WARN_THRESHOLD}%</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-foreground">
            {piiBelow}
          </div>
          <div className="text-[11px] text-slate-400">of {PII_HYGIENE.length} hygiene checks</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <div className="text-xs font-medium text-muted">Records lost to leaks (30d)</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-rose-600">
            {fmtNumber(leakTotal)}
          </div>
          <div className="text-[11px] text-slate-400">
            across {LEAK_PATTERNS.length} known patterns
          </div>
        </div>
      </div>

      {/* 1 — Identifier capture-rate grid */}
      <Card
        title="Identifier Capture Rate vs. Target"
        subtitle="Per-identifier capture across the loop with 7-day trend"
        action={
          <div className="hidden items-center gap-3 text-[11px] text-muted sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> At/above
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Within 5
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Below
            </span>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {IDENTIFIER_RATES.map((r) => {
            const tone = rateTone(r);
            const delta = r.capture - r.target;
            return (
              <div
                key={r.id}
                className="rounded-xl border border-border bg-surface p-3.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <code className="rounded-md bg-surface-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                    {r.label}
                  </code>
                  <span
                    className={`text-[11px] font-semibold tabular-nums ${RATE_TONE_TEXT[tone]}`}
                  >
                    {fmtSignedPercent(delta, 0)} vs tgt
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className={`text-2xl font-bold tabular-nums ${RATE_TONE_TEXT[tone]}`}>
                    {fmtPercent(r.capture, 0)}
                  </span>
                  <span className="text-[11px] text-muted">/ {fmtPercent(r.target, 0)} target</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className={`h-full rounded-full ${RATE_TONE_BAR[tone]}`}
                    style={{ width: `${Math.min(r.capture, 100)}%` }}
                  />
                </div>
                <div className="mt-2.5 h-8">
                  <Sparkline data={r.trend} color={RATE_TONE_SPARK[tone]} height={32} />
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] text-muted" title={r.note}>
                    {r.note}
                  </span>
                  <span className={`shrink-0 text-[10px] font-medium ${RATE_TONE_TEXT[tone]}`}>
                    {RATE_TONE_LABEL[tone]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 2 — Cross-hop drop-off waterfall + 6 — capture trend */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          title="Cross-Hop Drop-Off"
          subtitle="Where each click ID disappears between capture and platform"
        >
          <HopWaterfall />
        </Card>

        <Card
          title="Capture Rate Over Time"
          subtitle="7-day capture trend for key click & PII identifiers (D-6 → D0)"
        >
          <CaptureTrend />
        </Card>
      </div>

      {/* 3 — Coverage grid (source × stage) */}
      <Card
        title="Identifier Coverage — Source × Stage"
        subtitle="Per-key presence on records, by traffic source and funnel stage"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-3 py-2 text-left font-medium">Source</th>
                <th className="px-3 py-2 text-left font-medium">Stage</th>
                <th className="px-3 py-2 text-right font-medium">Records</th>
                {COVERAGE_KEYS.map((k) => (
                  <th key={k.key} className="px-3 py-2 text-right font-medium">
                    {k.label}
                  </th>
                ))}
                <th className="px-3 py-2 text-right font-medium">Health</th>
              </tr>
            </thead>
            <tbody>
              {COVERAGE.map((row, i) => (
                <tr
                  key={`${row.source}-${row.stage}-${i}`}
                  className="border-b border-border/70 hover:bg-surface-muted"
                >
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: SOURCE_DOT[row.source] ?? PALETTE.slate }}
                      />
                      {row.source}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-muted">{row.stage}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-foreground">
                    {fmtNumber(row.records)}
                  </td>
                  {COVERAGE_KEYS.map((k) => {
                    const v = row[k.key] as number;
                    return (
                      <td
                        key={k.key}
                        className={`px-3 py-2.5 text-right font-medium tabular-nums ${coverageCellClass(v)}`}
                      >
                        {v === 0 ? "—" : fmtPercent(v, 0)}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2.5 text-right">
                    <StatusBadge status={HEALTH_BADGE[row.health]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-muted">
          Full match key = at least one durable click ID plus a hashed PII pair
          (email + phone). Cells below 65% are flagged for backfill.
        </p>
      </Card>

      {/* 4 — PII hygiene + 5 — leak log */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card
          className="lg:col-span-2"
          title="PII Hygiene Monitor"
          subtitle={`Normalization & hashing conformance · warn under ${PII_WARN_THRESHOLD}%`}
        >
          <div className="space-y-3.5">
            {PII_HYGIENE.map((p) => {
              const ok = p.conforming >= PII_WARN_THRESHOLD;
              return (
                <div key={p.check}>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-muted">{p.check}</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        ok ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {fmtPercent(p.conforming)}
                    </span>
                  </div>
                  <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className={`h-full rounded-full ${
                        ok ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${p.conforming}%` }}
                    />
                    <span
                      className="absolute top-[-2px] bottom-[-2px] w-px bg-rose-400"
                      style={{ left: `${PII_WARN_THRESHOLD}%` }}
                      aria-hidden
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            {piiBelow} check{piiBelow === 1 ? "" : "s"} under the {PII_WARN_THRESHOLD}% line —
            phone E.164 normalization is the weakest link feeding hashing.
          </div>
        </Card>

        <Card
          className="lg:col-span-3"
          title="Identifier-Loss Root Cause Log"
          subtitle={`${fmtNumber(leakTotal)} records lost across ${LEAK_PATTERNS.length} reproducible patterns`}
          action={
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
              <Wrench className="h-3.5 w-3.5" /> Fix queued
            </span>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="px-3 py-2 text-left font-medium">Pattern</th>
                  <th className="px-3 py-2 text-left font-medium">Hop</th>
                  <th className="px-3 py-2 text-right font-medium">Affected</th>
                  <th className="px-3 py-2 text-left font-medium">Fix</th>
                </tr>
              </thead>
              <tbody>
                {LEAK_PATTERNS.map((l) => (
                  <tr
                    key={l.pattern}
                    className="border-b border-border/70 align-top hover:bg-surface-muted"
                  >
                    <td className="px-3 py-2.5 font-medium text-foreground">{l.pattern}</td>
                    <td className="px-3 py-2.5">
                      <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] text-muted">
                        {l.hop}
                      </code>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-rose-600">
                      {fmtNumber(l.affected)}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-muted">{l.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
