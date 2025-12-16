import AdminSidebar from "../components/Sidebar/admin-sidebar";
import Topbar from "@/components/Topbar";
import AdminStructureWaiting from "@/components/structures-list/affichage-structure-waiting";
import AdminCarteWaiting from "@/components/cartes-list/affichage-cartes-waiting";
import style from "./admin-waiting.module.css";

export default function AdminWaitingPage() {
  return (
    <div className="admin-container">
      <Topbar title="Bourges 2028 - Administration" />

      <div className="admin-content">
        <AdminSidebar />

        <main className="admin-main">
            <section className={style.admin_top_content}>
                <h2>Contenus en attente de validation</h2>
                <p>
                Retrouvez ici les structures et cartes soumises, en attente de validation
                par l’administration.
                </p>
            </section>

            <section className={style.admin_section}>
                <div className={style.admin_section_header}>
                <h3>Structures à valider</h3>
                <i className="bi bi-building-check"></i>
                </div>
                <AdminStructureWaiting waiting />
            </section>

            <section className={style.admin_section}>
                <div className={style.admin_section_header}>
                <h3>Cartes annexes à valider</h3>
                <i className="bi bi-collection"></i>
                </div>
                <AdminCarteWaiting waiting />
            </section>
            </main>

      </div>
    </div>
  );
}
