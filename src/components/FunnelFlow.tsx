import { ChevronRight } from "lucide-react";
import { FUNNEL } from "@/lib/data";
import { fmtNumber, fmtCurrency } from "@/lib/format";

const STAGE_TINT: Record<string, string> = {
  Lead: "border-sky-200 bg-sky-50",
  Underwriting: "border-violet-200 bg-violet-50",
  Qualified: "border-amber-200 bg-amber-50",
  Enrolled: "border-emerald-200 bg-emerald-50",
};

export default function FunnelFlow() {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
      {FUNNEL.map((s, i) => (
        <div key={s.stage} className="flex flex-1 items-center gap-2">
          <div
            className={`flex-1 rounded-xl border px-4 py-3 ${STAGE_TINT[s.stage]}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{s.stage}</span>
              {s.cvr !== null && (
                <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
                  {s.cvr}% CVR
                </span>
              )}
            </div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {fmtNumber(s.count)}
            </div>
            <div className="mt-1 text-[11px] text-muted">
              {s.value > 0 ? `${fmtCurrency(s.value, { compact: true })} tracked` : "micro-value"}
              {s.avgDays > 0 ? ` · ${s.avgDays}d avg` : ""}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 border-t border-white/60 pt-2 text-[11px]">
              <span className="flex items-center gap-1 text-muted">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#1a73e8" }} />
                G {fmtNumber(s.postedGoogle)}
              </span>
              <span className="flex items-center gap-1 text-muted">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#0866ff" }} />
                M {fmtNumber(s.postedMeta)}
              </span>
            </div>
            {s.leakage > 0 && (
              <div className="mt-1 text-[11px] font-medium text-rose-600">
                {s.leakage} never posted back
              </div>
            )}
          </div>
          {i < FUNNEL.length - 1 && (
            <ChevronRight className="hidden h-5 w-5 shrink-0 text-slate-300 lg:block" />
          )}
        </div>
      ))}
    </div>
  );
}
