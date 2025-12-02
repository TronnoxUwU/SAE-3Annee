
// import "./styles/admin.css";

import AdminSidebar from "../components/Sidebar/admin-sidebar";
import Topbar from "@/components/Topbar.jsx";
import AdminStructure from "@/components/structures-list/affichage-structure";

export default function AdminPage() {

  return (
    <div className="admin-container">
      <Topbar title="Bourges 2028 - Administration"/>

      <div className="admin-content">
        <AdminSidebar />

        <main className="admin-main">
          <div className="admin-top-content">
            <h2>Voici les structures présentes sur la plateforme</h2>
          </div>

          <AdminStructure />
          
        </main>
      </div>
    </div>
  );
}
