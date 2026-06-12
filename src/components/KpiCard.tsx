import * as Icons from "lucide-react";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { Kpi } from "@/lib/data";
import { fmtSignedPercent } from "@/lib/format";

const TONE_RING: Record<string, string> = {
  good: "ring-emerald-500/15",
  watch: "ring-amber-500/15",
  bad: "ring-rose-500/15",
};

const TONE_ICON: Record<string, string> = {
  good: "bg-emerald-50 text-emerald-600",
  watch: "bg-amber-50 text-amber-600",
  bad: "bg-rose-50 text-rose-600",
};

export default function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = (Icons[kpi.icon as keyof typeof Icons] as LucideIcon) ?? Icons.Activity;
  const up = kpi.delta >= 0;
  // delta direction is "good" when it matches goodWhenUp
  const positive = up === kpi.goodWhenUp;
  const DeltaIcon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <div
      className={`group rounded-xl border border-border bg-surface p-5 shadow-sm ring-1 ${TONE_RING[kpi.tone]} transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${TONE_ICON[kpi.tone]}`}
        >
          <Icon className="h-5 w-5" strokeWidth={2.1} />
        </div>
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold ${
            positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          <DeltaIcon className="h-3.5 w-3.5" />
          {fmtSignedPercent(kpi.delta)}
        </span>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {kpi.value}
        </div>
        <div className="mt-1 text-sm font-medium text-muted">{kpi.label}</div>
        <div className="mt-0.5 text-xs text-slate-400">{kpi.target}</div>
      </div>
    </div>
  );
}
