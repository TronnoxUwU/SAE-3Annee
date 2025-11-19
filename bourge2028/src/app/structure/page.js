
// import "./styles/admin.css";

import Topbar from "@/components/Topbar.jsx";
import Structure from "@/components/structures-list/affichage-structure-pretty";

export default function AdminPage() {

  return (
    <>
      <Topbar title="Bourges 2028 - Structures"/>

      <div className="container">

        <main className="main">
          <div className="top-content">
            <h2>Voici les structures présentes sur la plateforme</h2>
          </div>

          <Structure />
          
        </main>
      </div>
    </>
  );
}
