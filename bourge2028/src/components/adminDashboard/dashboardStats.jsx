
import style from "./admin-dashboard.module.css"

export default function DashboardStats({ stats }) {
  return (
    <section className={`${style.dashboard_stats} ${style.dashboard_bloc}`}>
      <Stat title="Visiteurs ce mois-ci" value={stats.visitorsMonth} icon="bi-people" />
      <Stat title="Structures" value={stats.structures} icon="bi-building" />
      <Stat title="Cartes" value={stats.cartes} icon="bi-journal-text" />
      <Stat
        title="En attente"
        value={stats.waiting}
        icon="bi-clock-history"
        variant="warning"
      />
    </section>
  );
}

function Stat({ title, value, icon, variant }) {
  return (
    <div className={`${style.stat_card} ${style[variant] || ""}`}>
      <i className={`bi ${icon}`}></i>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
