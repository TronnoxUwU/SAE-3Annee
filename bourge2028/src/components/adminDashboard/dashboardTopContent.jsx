
import style from "./admin-dashboard.module.css"

export default function DashboardTopContent({ data }) {
  return (
    <section className={`${style.dashboard_pages_content, style.dashboard_bloc}`}>
      <h2>Contenus les plus consultés</h2>

      <ul className="top-list">
        {data.map(item => (
          <li key={item.page}>
            <span>{item.title || item.page}</span>
            <strong>{item.visits}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
