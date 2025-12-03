
// import "./styles/admin.css";

import Topbar from "@/components/Topbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar";
import Structure from "@/components/structures-list/affichage-structure-pretty";
import Style from "./page.module.css";

export default function AdminPage() {

  return (
    <>
      <Topbar title="Bourges 2028 - Structures" fixed/>

      <div>
      <Sidebar map={null} onFilterChange={null} onGeoFilterChange={null} />

        <main className={Style.main}>
          <div className="top-content">
            <h2 className={Style.titre_stylee}>Voici les structures présentes sur la plateforme</h2>
          </div>

          <Structure />
          
        </main>
      </div>
    </>
  );
}
