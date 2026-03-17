"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartPoint = { label: string; value: number };

const fallbackData: ChartPoint[] = [
  { label: "Sen", value: 120 },
  { label: "Sel", value: 180 },
  { label: "Rab", value: 160 },
  { label: "Kam", value: 240 },
  { label: "Jum", value: 310 },
  { label: "Sab", value: 280 },
  { label: "Min", value: 360 }
];

export function AnalyticsChart({ title = "Views Mingguan", data = fallbackData }: { title?: string; data?: ChartPoint[] }) {
  return (
    <div className="surface p-6 h-64">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="views" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#ff6b6b" fill="url(#views)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
