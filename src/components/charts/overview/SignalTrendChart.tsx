"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { DAILY, PALETTE } from "@/lib/data";
import ChartTooltip from "../ChartTooltip";

export default function SignalTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={DAILY} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="eventsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.indigo} stopOpacity={0.3} />
            <stop offset="100%" stopColor={PALETTE.indigo} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          interval={3}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[60, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="eventsSent"
          name="Events sent"
          stroke={PALETTE.indigo}
          strokeWidth={2.5}
          fill="url(#eventsGrad)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="matched"
          name="Matched %"
          stroke={PALETTE.matched}
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="metaCapi"
          name="Meta CAPI %"
          stroke={PALETTE.meta}
          strokeWidth={2}
          strokeDasharray="4 3"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
