"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
} from "recharts";
import { LAG_DISTRIBUTION, PALETTE } from "@/lib/data";
import ChartTooltip from "../ChartTooltip";

const AT_RISK = "90d+ (at risk)";

export default function LagChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={LAG_DISTRIBUTION}
        margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
        barGap={4}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis
          dataKey="bucket"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip cursor={{ fill: "#f8fafc" }} content={<ChartTooltip suffix=" enrolled" />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        {/* gclid expires at 90d; Meta click window is 7d — flag the tail */}
        <ReferenceLine
          x={AT_RISK}
          stroke={PALETTE.rose}
          strokeDasharray="4 3"
          ifOverflow="extendDomain"
        />
        <Bar dataKey="google" name="Google" radius={[4, 4, 0, 0]} barSize={16}>
          {LAG_DISTRIBUTION.map((d) => (
            <Cell
              key={`g-${d.bucket}`}
              fill={d.bucket === AT_RISK ? PALETTE.rose : PALETTE.google}
            />
          ))}
        </Bar>
        <Bar dataKey="meta" name="Meta" radius={[4, 4, 0, 0]} barSize={16}>
          {LAG_DISTRIBUTION.map((d) => (
            <Cell
              key={`m-${d.bucket}`}
              fill={d.bucket === AT_RISK ? "#fb7185" : PALETTE.meta}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
