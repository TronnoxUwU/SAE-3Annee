import AdminSidebar from "./components/Sidebar/admin-sidebar";
import Topbar from "@/components/Topbar.jsx";
import AdminHomeStats from "./components/Main-menu/admin-home-stats";
import AdminMenu from "./components/Main-menu/admin-carousel";
import style from "./admin.module.css"


export default function AdminPage() {
  return (
    <div className="admin-container">
      <Topbar title="Bourges 2028 - Administration" />

      <div className="admin-content">
        <AdminSidebar />

        <main className="admin-main">
          {/* HEADER */}
          {/* <section className="admin-top-content">
            <h2>Bienvenue sur le panneau d’administration</h2>
            <p>Vue d’ensemble et accès rapide aux outils de gestion.</p>
          </section> */}

          <div className={style.heroSection}>
            <div className={style.heroContent}>
              <h2 className={style.mainTitle}>Bienvenue sur le panneau d’administration</h2>
              

              <p className={style.description}>
                Vue d’ensemble et accès rapide aux outils de gestion.
              </p>
            </div>

              <img
                  src="/images/region-min.png"
                  alt="representation structure"
                  className={style.showImage}
              />
          </div>

          {/* Menu */}
          <AdminMenu />

          {/* Stats (juste nb d'users) */}
          <AdminHomeStats />

        </main>
      </div>
    </div>
  );
}
