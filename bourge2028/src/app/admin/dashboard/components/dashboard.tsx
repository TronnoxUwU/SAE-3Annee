"use client";

import { useEffect, useState } from "react";
import DashboardChart from "./chart";

export default function DashboardClient() {
  const [filter, setFilter] = useState("7");
  const [data, setData] = useState([]);

  const fetchData = async (filterValue: string) => {
    const res = await fetch(`/api/dashboard?filter=${filterValue}`);
    const chartData = await res.json();
    setData(chartData);
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  return (
    <section className="p-6">
      <h1 className="text-xl font-bold mb-4">Pages les plus consultées</h1>
      <select
        name="date-visite"
        id="date-visite-select"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4"
      >
        <option value="7">7 derniers jours</option>
        <option value="14">14 derniers jours</option>
        <option value="30">30 derniers jours</option>
        <option value="180">6 derniers mois</option>
        <option value="year">Année en cours</option>
      </select>

      <DashboardChart data={data} />
    </section>
  );
}
