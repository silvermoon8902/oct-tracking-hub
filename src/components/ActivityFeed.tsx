import StatusBadge from "@/components/StatusBadge";
import { SIGNAL_FEED } from "@/lib/data";
import { fmtCurrency } from "@/lib/format";

const SOURCE_TINT: Record<string, string> = {
  Google: "bg-sky-50 text-sky-700",
  Meta: "bg-blue-50 text-blue-700",
  CallRail: "bg-amber-50 text-amber-700",
  Forth: "bg-slate-100 text-slate-600",
};

export default function ActivityFeed() {
  return (
    <ul className="divide-y divide-border">
      {SIGNAL_FEED.map((e) => (
        <li key={e.id} className="flex items-start gap-3 py-3">
          <span
            className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${SOURCE_TINT[e.source]}`}
          >
            {e.source}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-foreground">
                {e.eventName}
                <span className="ml-1.5 font-normal text-muted">· {e.stage}</span>
              </span>
              <span className="shrink-0 text-[11px] text-slate-400">{e.time}</span>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted">{e.detail}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <StatusBadge status={e.status} />
              <span className="text-[11px] text-slate-400">→ {e.destination}</span>
              {e.value ? (
                <span className="text-[11px] font-medium text-emerald-600">
                  {fmtCurrency(e.value)}
                </span>
              ) : null}
              {e.emq !== undefined && (
                <span className="text-[11px] text-slate-400">EMQ {e.emq}</span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
