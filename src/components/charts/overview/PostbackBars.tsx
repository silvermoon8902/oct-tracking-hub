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
} from "recharts";
import { ATTRIBUTION, PALETTE } from "@/lib/data";
import ChartTooltip from "../ChartTooltip";

const data = ATTRIBUTION.map((a) => ({
  platform: a.platform.replace(" (Phone)", "").replace(" / Direct", ""),
  CRM: a.crmValue,
  Platform: a.platformValue,
}));

export default function PostbackBars() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis
          dataKey="platform"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={46}
        />
        <Tooltip cursor={{ fill: "#f8fafc" }} content={<ChartTooltip money />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="CRM" name="CRM actual" fill={PALETTE.slate} radius={[4, 4, 0, 0]} barSize={18} />
        <Bar dataKey="Platform" name="Platform-reported" fill={PALETTE.indigo} radius={[4, 4, 0, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
