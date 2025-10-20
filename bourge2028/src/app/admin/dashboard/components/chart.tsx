"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function DashboardChart({ data }) {
  return (
    <BarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="page" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="visits" fill="#3b82f6" />
    </BarChart>
  );
}
