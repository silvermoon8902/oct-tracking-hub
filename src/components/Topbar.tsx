"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  ChevronDown,
  CircleCheck,
  Bell,
  RefreshCw,
} from "lucide-react";
import { ACCOUNT } from "@/lib/data";

const RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "Quarter to date"];

export default function Topbar() {
  const [range, setRange] = useState(ACCOUNT.window);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="relative hidden flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, gclid, event_id, campaign…"
            className="w-full rounded-lg border border-border bg-surface-muted py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-slate-400 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/15"
          />
        </div>

        <div className="md:flex-1" />

        {/* Loop health pill */}
        <div className="hidden items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 lg:flex">
          <CircleCheck className="h-3.5 w-3.5" />
          Loop healthy · 81/100
        </div>

        {/* Date range */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
          >
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">{range}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRange(r);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-surface-muted ${
                    r === range ? "font-semibold text-brand" : "text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sync */}
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted xl:flex">
          <RefreshCw className="h-3.5 w-3.5" />
          {ACCOUNT.lastSync}
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg border border-border bg-surface p-2 text-slate-500 hover:bg-surface-muted">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
            MO
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-semibold text-foreground">Media Ops</div>
            <div className="text-[11px] text-muted">Attribution</div>
          </div>
        </div>
      </div>
    </header>
  );
}
