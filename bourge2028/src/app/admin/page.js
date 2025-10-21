
// import "./styles/admin.css";

import AdminSidebar from "./components/admin-sidebar";
import AdminMenu from "./components/admin-carousel";
import Topbar from "@/components/Topbar.jsx";

export default function AdminPage() {

  return (
    <div className="admin-container">
      <Topbar title="Bourges 2028 - Administration"/>

      <div className="admin-content">
        <AdminSidebar />

        <main className="admin-main">
          <div className="admin-top-content">
            <h2>Bienvenue sur le panneau d’administration</h2>
            <p>Sélectionnez une section dans le menu.</p>
          </div>
          
          <AdminMenu />
        </main>
      </div>
    </div>
  );
}
