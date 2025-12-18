"use client";

import style from "./admin-dashboard.module.css"


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className={style.chart_tooltip}>
      <strong>{label}</strong>
      <p>{payload[0].value} visites</p>
    </div>
  );
};

export default function TrafficChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        <XAxis
          dataKey="label"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} />

        <Bar
          dataKey="visiteurs uniques"
          fill="#6366f1"
          radius={[6, 6, 0, 0]}
          activeBar={{ fill: "#4f46e5" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
