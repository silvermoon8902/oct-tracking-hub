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
  LabelList,
} from "recharts";
import { FUNNEL, PALETTE } from "@/lib/data";
import ChartTooltip from "../ChartTooltip";

const STAGE_FILL: Record<string, string> = {
  Lead: PALETTE.sky,
  Underwriting: PALETTE.violet,
  Qualified: PALETTE.amber,
  Enrolled: PALETTE.emerald,
};

const data = FUNNEL.map((s) => ({
  stage: s.stage,
  count: s.count,
  cvr: s.cvr,
}));

export default function StageFunnelChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 4, right: 56, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="stage"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={92}
        />
        <Tooltip cursor={{ fill: "#f8fafc" }} content={<ChartTooltip />} />
        <Bar dataKey="count" name="Records" radius={[0, 6, 6, 0]} barSize={30}>
          {data.map((d) => (
            <Cell key={d.stage} fill={STAGE_FILL[d.stage]} />
          ))}
          <LabelList
            dataKey="cvr"
            position="right"
            formatter={(v: string | number | boolean | null | undefined) =>
              v === null || v === undefined ? "entry" : `${v}% CVR`
            }
            style={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
