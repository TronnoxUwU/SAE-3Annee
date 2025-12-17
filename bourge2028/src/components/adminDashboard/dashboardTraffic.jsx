import TrafficChart from "./trafficChart";
import style from "./admin-dashboard.module.css"

export default function DashboardTraffic({ data, period, onChange }) {
  return (
    <section className={`${style.dashboard_traffic, style.dashboard_bloc}`}>
      <header className="dashboard-header">
        <h2>Trafic du site (nombre de visiteurs uniques)</h2>

        <select
          value={period}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="day">Par jour</option>
          <option value="week">Par semaine</option>
          <option value="month">Par mois</option>
        </select>
      </header>

      <div className={style.dashboard_chart}>
        <TrafficChart data={data} />
    </div>

    </section>
  );
}
