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
import { RECONCILIATION, PALETTE } from "@/lib/data";
import ChartTooltip from "../ChartTooltip";

// CRM source-of-truth volume per stage vs. what each platform actually accepted.
const data = RECONCILIATION.map((r) => ({
  stage: r.stage,
  CRM: r.crm,
  Google: r.google,
  Meta: r.meta,
}));

export default function ReconciliationChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
        barGap={3}
        barCategoryGap="22%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis
          dataKey="stage"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip cursor={{ fill: "#f8fafc" }} content={<ChartTooltip />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="CRM" name="CRM (truth)" fill={PALETTE.slate} radius={[4, 4, 0, 0]} barSize={20} />
        <Bar dataKey="Google" name="Google accepted" fill={PALETTE.google} radius={[4, 4, 0, 0]} barSize={20} />
        <Bar dataKey="Meta" name="Meta deduped" fill={PALETTE.meta} radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
