"use client";

import { useEffect, useState } from "react";
import DashboardStats from "./dashboardStats";
import DashboardTraffic from "./dashboardTraffic";
import DashboardTopContent from "./dashboardTopContent";
import style from "./admin-dashboard.module.css"

export default function DashboardClient() {
  const [stats, setStats] = useState(null);
  const [traffic, setTraffic] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [period, setPeriod] = useState("day");
  const [filter, setFilter] = useState("30");

  useEffect(() => {
    fetch("/api/dashboard/stats").then(r => r.json()).then(setStats);
        fetch(`/api/dashboard/traffic?period=${period}`)
            .then(res => res.json())
            .then(setTraffic);
        fetch(`/api/dashboard/top-pages?range=${filter}`)
            .then(r => r.json())
            .then(setTopPages);
    }, [filter, period]);


  if (!stats) {
    return (
      <>
        <div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="text-muted">Chargement du dashboard...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardStats stats={stats} />
      <DashboardTopContent data={topPages} />
      <DashboardTraffic data={traffic} period={period} onChange={setPeriod}/>
    </>
  );
}
