"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { EMQ_KEYS, PALETTE } from "@/lib/data";
import ChartTooltip from "../ChartTooltip";

// Per-parameter EMQ coverage for the selected event (Lead). Weakest keys are
// drawn in amber/rose so the gaps that drag match quality down are obvious.
const data = EMQ_KEYS.map((k) => ({
  key: k.key,
  present: k.present,
}));

function barColor(present: number): string {
  if (present >= 95) return PALETTE.emerald;
  if (present >= 85) return PALETTE.meta;
  if (present >= 75) return PALETTE.amber;
  return PALETTE.rose;
}

export default function EmqBars() {
  return (
    <ResponsiveContainer width="100%" height={288}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="key"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={104}
        />
        <Tooltip
          cursor={{ fill: "#f8fafc" }}
          content={<ChartTooltip suffix="% present" />}
        />
        <Bar dataKey="present" name="Coverage" radius={[0, 4, 4, 0]} barSize={16}>
          {data.map((d) => (
            <Cell key={d.key} fill={barColor(d.present)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
