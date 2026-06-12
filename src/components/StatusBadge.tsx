const STYLES: Record<string, string> = {
  // Health
  Healthy: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Critical: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Degraded: "bg-amber-50 text-amber-700 ring-amber-600/20",
  // Signals
  Matched: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Attributed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Received: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Deduped: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  Unmatched: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Dropped: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Duplicate: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Missing: "bg-rose-50 text-rose-700 ring-rose-600/20",
  // Zap / runtime
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Paused: "bg-slate-100 text-slate-600 ring-slate-500/20",
  Error: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Filtered: "bg-slate-100 text-slate-600 ring-slate-500/20",
  Replayed: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = STYLES[status] ?? "bg-slate-100 text-slate-600 ring-slate-500/20";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
