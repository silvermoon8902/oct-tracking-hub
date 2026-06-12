"use client";

import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

export default function LoopHealthGauge({ score = 81 }: { score?: number }) {
  const band = score >= 85 ? "#16a34a" : score >= 70 ? "#d97706" : "#e11d48";
  const data = [{ name: "score", value: score, fill: band }];
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <RadialBarChart
          innerRadius="78%"
          outerRadius="100%"
          barSize={16}
          data={data}
          startAngle={220}
          endAngle={-40}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            background={{ fill: "#eef2f7" }}
            dataKey="value"
            cornerRadius={9}
            isAnimationActive={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight text-foreground">{score}</span>
        <span className="text-xs font-medium text-muted">Loop Health Score</span>
        <span
          className="mt-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: `${band}1a`, color: band }}
        >
          {score >= 85 ? "Healthy" : score >= 70 ? "Watch" : "Critical"}
        </span>
      </div>
    </div>
  );
}
