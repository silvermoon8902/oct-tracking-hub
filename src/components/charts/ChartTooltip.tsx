"use client";

import { fmtCurrency, fmtNumber } from "@/lib/format";

type Item = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
};

export default function ChartTooltip({
  active,
  payload,
  label,
  money = false,
  suffix = "",
}: {
  active?: boolean;
  payload?: Item[];
  label?: string | number;
  money?: boolean;
  suffix?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      {label !== undefined && (
        <div className="mb-1.5 font-semibold text-foreground">{label}</div>
      )}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: p.color }}
              />
              {p.name}
            </span>
            <span className="font-semibold text-foreground">
              {typeof p.value === "number"
                ? money
                  ? fmtCurrency(p.value)
                  : fmtNumber(p.value) + suffix
                : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
