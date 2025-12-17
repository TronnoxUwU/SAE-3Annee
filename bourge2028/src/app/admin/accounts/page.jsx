
import AdminSidebar from "../components/Sidebar/admin-sidebar";
import Topbar from "@/components/Topbar.jsx";
import AdminUsers from "@/components/User/affichage-personne";
import style from "./admin-accounts.module.css";

export default function AdminPage() {

  return (
    <div className="admin-container">
      <Topbar title="Bourges 2028 - Administration"/>

      <div className="admin-content">
        <AdminSidebar />

        <main className="admin-main">
            <section className={style.admin_top_content}>
                <h2>Gestion des comptes</h2>
                <p>
                Retrouvez ici toutes les personnes inscrites sur la plateforme. <br></br>
                En tant qu'Administrateur vous pouvez les consulter et les modifier.
                </p>
            </section>

          <AdminUsers />
          
        </main>
      </div>
    </div>
  );
}
