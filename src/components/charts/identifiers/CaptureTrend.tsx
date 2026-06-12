"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { IDENTIFIER_RATES, PALETTE } from "@/lib/data";
import ChartTooltip from "../ChartTooltip";

/** Identifiers surfaced on the 7-day capture trend and their line colors. */
const SELECTED: { id: string; color: string }[] = [
  { id: "gclid", color: PALETTE.google },
  { id: "fbc", color: PALETTE.meta },
  { id: "phone", color: PALETTE.violet },
  { id: "fbclid", color: PALETTE.amber },
];

const DAY_LABELS = ["D-6", "D-5", "D-4", "D-3", "D-2", "D-1", "D0"];

const picked = SELECTED.map((s) => {
  const row = IDENTIFIER_RATES.find((r) => r.id === s.id);
  return { ...s, label: row?.label ?? s.id, trend: row?.trend ?? [] };
});

// Pivot the per-identifier trend arrays into one point per day.
const data = DAY_LABELS.map((day, i) => {
  const point: Record<string, number | string> = { day };
  for (const p of picked) point[p.label] = p.trend[i];
  return point;
});

export default function CaptureTrend() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[55, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<ChartTooltip suffix="%" />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        {picked.map((p) => (
          <Line
            key={p.label}
            type="monotone"
            dataKey={p.label}
            stroke={p.color}
            strokeWidth={2.25}
            dot={{ r: 2.5, strokeWidth: 0, fill: p.color }}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
