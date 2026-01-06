"use client";

import { useEffect, useState } from "react";
import Style from "./admin-home-stats.module.css";

export default function AdminHomeStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <section className={Style.stats_grid}>
      <StatCard label="Utilisateurs" value={stats.users} icon="bi-people" />
    </section>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <a className={Style.stat_card} href="/admin/accounts">
      <i className={`bi ${icon} ${Style.icon}`}></i>
      <div>
        <p className={Style.value}>{value}</p>
        <p className={Style.label}>{label}</p>
      </div>
    </a>
  );
}
