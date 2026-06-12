import Image from "next/image";
import { Download, Radio, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import KpiCard from "@/components/KpiCard";
import Card from "@/components/Card";
import FunnelFlow from "@/components/FunnelFlow";
import ActivityFeed from "@/components/ActivityFeed";
import AlertsStrip from "@/components/AlertsStrip";
import SourceStrip from "@/components/SourceStrip";
import Sparkline from "@/components/charts/Sparkline";
import LoopHealthGauge from "@/components/charts/overview/LoopHealthGauge";
import SignalTrendChart from "@/components/charts/overview/SignalTrendChart";
import PostbackBars from "@/components/charts/overview/PostbackBars";
import { ACCOUNT, PRIMARY_KPIS, DESTINATIONS } from "@/lib/data";
import { fmtNumber, fmtPercent } from "@/lib/format";

export default function OverviewPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Command Center — Feedback-Loop Health"
        subtitle={`${ACCOUNT.brand} · ${ACCOUNT.vertical} · ${ACCOUNT.window}`}
      >
        <span className="hidden items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 sm:inline-flex">
          <Radio className="h-3.5 w-3.5" />
          Demo data
        </span>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--ink)] px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
          <Download className="h-4 w-4" />
          Export
        </button>
      </PageHeader>

      {/* Hero band */}
      <div className="relative overflow-hidden rounded-2xl border border-border shadow-sm">
        <Image
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=75&auto=format&fit=crop"
          alt="Analytics dashboard"
          width={1600}
          height={420}
          priority
          className="h-44 w-full object-cover sm:h-52"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)]/94 via-[var(--ink)]/74 to-[var(--ink)]/20" />
        <div className="absolute inset-0 flex flex-col justify-center gap-2 p-6 sm:p-8">
          <span className="w-fit rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            Closed-loop OCT · CRM → Zapier → Google Ads + Meta
          </span>
          <h2 className="max-w-2xl text-xl font-bold text-white sm:text-2xl">
            Every qualified and enrolled outcome, matched and posted back — clean,
            deduped, and optimizable.
          </h2>
          <p className="max-w-xl text-sm text-white/75">
            One view that proves the feedback loop is actually closing: identifier
            capture, EMQ, dedup, attribution coverage, and platform acceptance.
          </p>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRIMARY_KPIS.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Health gauge + funnel flow */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          title="Loop Health"
          subtitle="Composite of capture, match, EMQ, dedup, uptime"
        >
          <LoopHealthGauge score={81} />
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-surface-muted px-3 py-2">
              <div className="font-semibold text-foreground">82%</div>
              <div className="text-muted">Google match</div>
            </div>
            <div className="rounded-lg bg-surface-muted px-3 py-2">
              <div className="font-semibold text-foreground">7.0</div>
              <div className="text-muted">Meta EMQ</div>
            </div>
            <div className="rounded-lg bg-surface-muted px-3 py-2">
              <div className="font-semibold text-foreground">98.4%</div>
              <div className="text-muted">Dedup</div>
            </div>
            <div className="rounded-lg bg-surface-muted px-3 py-2">
              <div className="font-semibold text-foreground">99.1%</div>
              <div className="text-muted">Zap uptime</div>
            </div>
          </div>
        </Card>

        <Card
          className="lg:col-span-2"
          title="Funnel Flow → Platforms"
          subtitle="CRM outcome stages posted back to Google Ads OCT & Meta CAPI"
        >
          <FunnelFlow />
        </Card>
      </div>

      {/* Destination post-back tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DESTINATIONS.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                {d.slug ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://cdn.simpleicons.org/${d.slug}`}
                    alt={d.name}
                    width={18}
                    height={18}
                    className="h-[18px] w-[18px]"
                  />
                ) : (
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: d.color }}
                  />
                )}
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                {fmtPercent(d.acceptedRate)} accepted
              </span>
            </div>
            <div className="mt-3 text-sm font-semibold leading-tight text-foreground">
              {d.name}
            </div>
            <div className="text-[11px] text-muted">{d.detail}</div>
            <div className="mt-3 flex items-end justify-between gap-2">
              <div>
                <div className="text-lg font-bold text-foreground">{fmtNumber(d.accepted)}</div>
                <div className="text-[11px] text-muted">
                  of {fmtNumber(d.sent)} sent · {d.metricLabel} {d.metricValue}
                </div>
              </div>
              <div className="h-9 w-20">
                <Sparkline data={d.spark} color={d.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trend + activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Signal Volume & Match Quality"
          subtitle="Events sent vs. matched % and Meta CAPI success · 30 days"
          action={
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Events
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Matched %
              </span>
            </div>
          }
        >
          <SignalTrendChart />
        </Card>

        <Card
          title="Live Signal Activity"
          subtitle="Latest conversions across the loop"
          bodyClassName="py-2"
        >
          <ActivityFeed />
        </Card>
      </div>

      {/* Posted-back vs CRM */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Revenue Posted Back vs. CRM Actual"
          subtitle="Forth CRM source-of-truth vs. value accepted by each platform"
        >
          <PostbackBars />
        </Card>

        <Card
          title="The Gap"
          subtitle="What the platforms can't yet see"
          action={
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-brand">
              Funnel <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          }
        >
          <div className="space-y-3">
            <div className="rounded-lg bg-rose-50 p-4">
              <div className="text-xs font-medium text-rose-700">
                Unattributable enrolled revenue
              </div>
              <div className="mt-0.5 text-2xl font-bold text-rose-700">$243.6K</div>
              <div className="text-[11px] text-rose-600/80">
                58 Enrolled outcomes with no surviving click ID or PII match
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-muted">Meta over-reports vs CRM</span>
                <span className="font-semibold text-amber-600">+12%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted">Google over-reports vs CRM</span>
                <span className="font-semibold text-emerald-600">+6%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted">Signal posted within window</span>
                <span className="font-semibold text-foreground">93%</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
          <span className="text-xs text-muted">Prioritized across all panels</span>
        </div>
        <AlertsStrip />
      </div>

      {/* Sources */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Connected Stack</h3>
          <span className="text-xs text-muted">Last sync {ACCOUNT.lastSync}</span>
        </div>
        <SourceStrip />
      </div>
    </div>
  );
}
