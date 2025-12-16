import Topbar from "@/components/Topbar";
import AdminSidebar from "../components/Sidebar/admin-sidebar";
import DashboardClient from "../../../components/adminDashboard/dashboard";
import style from "./admin-dashboard.module.css"

export default function AdminDashboardPage() {
  return (
    <div className="admin-container">
      <Topbar title="Bourges 2028 - Dashboard" />

      <div className="admin-content">
        <AdminSidebar />

        <main className="admin-main">
          {/* En-tête */}
          <section className={style.admin_top_content}>
              <h2>Statistiques du site</h2>
              <p>
              Retrouvez ici toutes les statistiques du site, des visites aux éléments inscrits.
              </p>
          </section>
          

          {/* Contenu dynamique */}
          <DashboardClient />
        </main>
      </div>
    </div>
  );
}
