"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import { FBC_WATERFALL, GCLID_WATERFALL, PALETTE, type HopPoint } from "@/lib/data";
import ChartTooltip from "../ChartTooltip";

type Key = "fbc" | "gclid";

const SERIES: Record<Key, { data: HopPoint[]; color: string; label: string }> = {
  fbc: { data: FBC_WATERFALL, color: PALETTE.meta, label: "fbc (Meta click)" },
  gclid: { data: GCLID_WATERFALL, color: PALETTE.google, label: "gclid (Google click)" },
};

/** Each hop, the % of the prior hop's identifiers that survived to this hop. */
function withDrops(rows: HopPoint[]) {
  return rows.map((r, i) => {
    const prev = i === 0 ? r.present : rows[i - 1].present;
    const drop = prev - r.present;
    return { ...r, drop };
  });
}

export default function HopWaterfall() {
  const [key, setKey] = useState<Key>("fbc");
  const series = SERIES[key];

  const rows = useMemo(() => withDrops(series.data), [series.data]);
  const worst = useMemo(
    () => rows.reduce((a, b) => (b.drop > a.drop ? b : a), rows[0]),
    [rows]
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-surface-muted p-0.5">
          {(Object.keys(SERIES) as Key[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKey(k)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                key === k
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-muted">
          Biggest drop:{" "}
          <span className="font-semibold text-rose-600">
            {worst.hop} (−{worst.drop} pts)
          </span>
        </span>
      </div>

      <ResponsiveContainer width="100%" height={232}>
        <BarChart
          data={rows}
          margin={{ top: 18, right: 8, left: 4, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
          <XAxis
            dataKey="hop"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            interval={0}
            tickFormatter={(v: string) => v.split(" ")[0]}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={38}
          />
          <Tooltip
            cursor={{ fill: "#f8fafc" }}
            content={<ChartTooltip suffix="%" />}
          />
          <Bar dataKey="present" name="Present" radius={[4, 4, 0, 0]} barSize={42}>
            <LabelList
              dataKey="present"
              position="top"
              formatter={(v: number) => `${v}%`}
              style={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
            />
            {rows.map((r) => (
              <Cell
                key={r.hop}
                fill={r.hop === worst.hop ? PALETTE.rose : series.color}
                fillOpacity={r.hop === worst.hop ? 1 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-2 text-[11px] text-muted">
        % of {series.label} surviving each hop · Landing → Form → Forth CRM →
        Zapier → Platform
      </div>
    </div>
  );
}
