
// import "./styles/admin.css";

import AdminSidebar from "../components/Sidebar/admin-sidebar";
import AdminCategory from "@/components/adminCategory/categoryList";
import Topbar from "@/components/Topbar.jsx";
import style from "./admin-categorie.module.css";

export default function AdminPage() {

  return (
    <div className="admin-container">
      <Topbar title="Bourges 2028 - Administration"/>

      <div className="admin-content">
        <AdminSidebar />

        <main className="admin-main">
          <section className={style.admin_top_content}>
              <h2>Categories implémentées sur la plateforme</h2>
              <p>
              Retrouvez ici les catégories utilisables par les structures afin d'être filtrées par les utilisateurs. <br></br>
              En tant qu'Administrateur vous pouvez en ajouter, les supprimer ou les modifier.
              </p>
          </section>

          <div>
            <AdminCategory />
          </div>
        </main>
      </div>
    </div>
  );
}
