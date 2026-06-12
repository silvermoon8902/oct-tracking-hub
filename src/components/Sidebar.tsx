"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  Fingerprint,
  Workflow,
  Radar,
  Radio,
  Database,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";
import { ACCOUNT, SOURCES } from "@/lib/data";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/funnel", label: "Funnel & Attribution", icon: GitBranch },
  { href: "/identifiers", label: "Identifier Health", icon: Fingerprint },
  { href: "/automation", label: "Zapier & Webhooks", icon: Workflow },
  { href: "/platforms", label: "Platforms", icon: Radar },
];

const FALLBACK: Record<string, LucideIcon> = { Database, PhoneCall };

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-800 bg-[var(--ink)] text-slate-300 lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
          <Radio className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold text-white">{ACCOUNT.brand}</div>
          <div className="text-[11px] font-medium tracking-wide text-slate-400">
            Tracking Command Center
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-2 flex-1 space-y-1 px-3">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Feedback loop
        </div>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand/15 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] ${active ? "text-brand" : "text-slate-500 group-hover:text-slate-300"}`}
                strokeWidth={2}
              />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />}
            </Link>
          );
        })}
      </nav>

      {/* Connected sources */}
      <div className="border-t border-slate-800 px-4 py-4">
        <div className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
          Connected sources
        </div>
        <div className="grid grid-cols-4 gap-2">
          {SOURCES.map((s) => {
            const Fallback = s.icon ? FALLBACK[s.icon] : null;
            return (
              <div
                key={s.name}
                title={`${s.name} — ${s.role}`}
                className="flex h-9 items-center justify-center rounded-md border border-slate-800 bg-slate-900/60"
              >
                {s.slug ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://cdn.simpleicons.org/${s.slug}/${s.color}`}
                    alt={s.name}
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                ) : Fallback ? (
                  <Fallback className="h-4 w-4" style={{ color: s.color }} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3 text-[11px] text-slate-500">
        <span>Demo · sample data</span>
        <span className="rounded bg-slate-800 px-1.5 py-0.5 font-medium text-slate-300">
          {ACCOUNT.environment}
        </span>
      </div>
    </aside>
  );
}
