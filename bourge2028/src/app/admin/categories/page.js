
// import "./styles/admin.css";

import AdminSidebar from "../components/Sidebar/admin-sidebar";
import AdminCategory from "./components/categoryList";
import Topbar from "@/components/Topbar.jsx";

export default function AdminPage() {

  return (
    <div className="admin-container">
      <Topbar title="Bourges 2028 - Management categories"/>

      <div className="admin-content">
        <AdminSidebar />

        <main className="admin-main">
          <div className="admin-top-content">
            <h2>Voici les catégories por... disponibles</h2>
            <p>Vous pouvez en ajouter, modifier et supprimer</p>

            <AdminCategory />
          </div>
        </main>
      </div>
    </div>
  );
}
