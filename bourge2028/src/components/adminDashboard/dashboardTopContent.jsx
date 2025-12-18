// dashboardTopContent.jsx
'use client';

import style from "./admin-dashboard.module.css";
import { resolvePageName } from "@/lib/pages";

export default function DashboardTopContent({ data }) {
  // Le filtrage reste ici pour garantir que l'affichage est propre au cas où l'API renverrait trop de données
  const pages = data
    .filter(item => 
      !item.page.startsWith("/admin") &&
      !item.page.startsWith("/api")
    )
    .map(item => ({
      ...item,
      // On utilise le 'title' enrichi par l'API, sinon resolvePageName
      displayName: item.title || resolvePageName(item.page),
    }));

  return (
    <section className={`${style.dashboard_pages_content} ${style.dashboard_bloc}`}>
      <h2>Contenus les plus consultés</h2>

      <ul className={style.page_list}>
        {pages.map(item => (
          <li key={item.page}>
            <span>{item.displayName}</span>
            <strong>{item.visits}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}