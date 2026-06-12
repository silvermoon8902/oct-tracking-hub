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
import { CAMPAIGNS, PALETTE } from "@/lib/data";
import ChartTooltip from "../ChartTooltip";

// Short labels keep the vertical axis legible; full name lives in the table.
const data = CAMPAIGNS.map((c) => ({
  name: c.name.split(" — ").slice(0, 2).join(" — "),
  platform: c.platform,
  value: c.value,
})).sort((a, b) => b.value - a.value);

export default function CampaignValueChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={156}
        />
        <Tooltip cursor={{ fill: "#f8fafc" }} content={<ChartTooltip money />} />
        <Bar dataKey="value" name="Enrolled value" radius={[0, 4, 4, 0]} barSize={16}>
          {data.map((d) => (
            <Cell
              key={d.name}
              fill={d.platform === "Google" ? PALETTE.google : PALETTE.meta}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
