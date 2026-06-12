import Link from "next/link";
import { AlertTriangle, AlertCircle, Info, ArrowRight, type LucideIcon } from "lucide-react";
import { ALERTS } from "@/lib/data";

const SEV: Record<string, { icon: LucideIcon; cls: string; ring: string }> = {
  critical: { icon: AlertCircle, cls: "text-rose-600 bg-rose-50", ring: "border-rose-200" },
  warning: { icon: AlertTriangle, cls: "text-amber-600 bg-amber-50", ring: "border-amber-200" },
  info: { icon: Info, cls: "text-sky-600 bg-sky-50", ring: "border-sky-200" },
};

export default function AlertsStrip() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {ALERTS.map((a) => {
        const s = SEV[a.severity];
        const Icon = s.icon;
        return (
          <Link
            key={a.id}
            href={a.page}
            className={`group flex gap-3 rounded-xl border ${s.ring} bg-surface p-3.5 shadow-sm transition-shadow hover:shadow-md`}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.cls}`}>
              <Icon className="h-[18px] w-[18px]" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight text-foreground">
                {a.title}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted">{a.detail}</p>
              <span className="mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-semibold text-brand">
                {a.pageLabel}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
