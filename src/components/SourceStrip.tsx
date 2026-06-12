import { Database, PhoneCall, type LucideIcon } from "lucide-react";
import { SOURCES } from "@/lib/data";

const FALLBACK: Record<string, LucideIcon> = { Database, PhoneCall };

/**
 * Live connection strip — real product logos (Simple Icons CDN) for each system
 * in the tracking stack, with a lucide fallback for tools without a brand logo.
 */
export default function SourceStrip() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {SOURCES.map((s) => {
        const Fallback = s.icon ? FALLBACK[s.icon] : null;
        return (
          <div
            key={s.name}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 shadow-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
              {s.slug ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://cdn.simpleicons.org/${s.slug}/${s.color}`}
                  alt={s.name}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              ) : Fallback ? (
                <Fallback className="h-5 w-5" style={{ color: s.color }} />
              ) : null}
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-foreground">
                {s.name}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="truncate text-[11px] text-muted">{s.lastSync}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
