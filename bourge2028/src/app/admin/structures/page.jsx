
// import "./styles/admin.css";

import AdminSidebar from "../components/Sidebar/admin-sidebar";
import Topbar from "@/components/Topbar.jsx";
import AdminStructure from "@/components/structures-list/affichage-structure";
import style from "./admin-structure.module.css";

export default function AdminPage() {

  return (
    <div className="admin-container">
      <Topbar title="Bourges 2028 - Administration"/>

      <div className="admin-content">
        <AdminSidebar />

        <main className="admin-main">
            <section className={style.admin_top_content}>
                <h2>Structures culturelles disponible sur la plateforme</h2>
                <p>
                Retrouvez ici les structures validées et disponibles par tous. <br></br>
                En tant qu'Administrateur vous pouvez les consulter et les modifier.
                </p>
            </section>

          <AdminStructure />
          
        </main>
      </div>
    </div>
  );
}
