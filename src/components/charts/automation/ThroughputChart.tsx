"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { DAILY, PALETTE } from "@/lib/data";
import ChartTooltip from "../ChartTooltip";

/**
 * Zapier throughput: daily events sent (bars, left axis) overlaid with the Zap
 * error rate (line, right axis). The error rate is derived from the data layer
 * as zapErrors / eventsSent so the May 15 auth-outage spike reads clearly.
 */
const DATA = DAILY.map((d) => ({
  date: d.date,
  eventsSent: d.eventsSent,
  zapErrors: d.zapErrors,
  errorRate: Number(((d.zapErrors / d.eventsSent) * 100).toFixed(2)),
}));

export default function ThroughputChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={DATA} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
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
          width={40}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 3]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<ChartTooltip />} />
        <ReferenceLine
          yAxisId="left"
          x="5/15"
          stroke={PALETTE.rose}
          strokeDasharray="4 3"
          strokeWidth={1.5}
          label={{
            value: "May 15 outage",
            position: "insideTopRight",
            fontSize: 10,
            fill: PALETTE.rose,
          }}
        />
        <Bar
          yAxisId="left"
          dataKey="eventsSent"
          name="Events sent"
          fill={PALETTE.indigo}
          radius={[3, 3, 0, 0]}
          maxBarSize={14}
          isAnimationActive={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="errorRate"
          name="Error rate %"
          stroke={PALETTE.rose}
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
