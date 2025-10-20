"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./styles/admin.css";


import Topbar from "@/components/Topbar.jsx";

export default function AdminPage() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", image: "/images/data.png" },
    { name: "Catégories", path: "/admin/categories", image: "/images/categorie.png" },
    { name: "Structures", path: "/admin/structures", image: "/images/structure.png" },
  ];

  return (
    <div className="admin-container">
      <Topbar title="Bourges 2028 - Administration"/>
      {/* <header className="admin-topbar">
        <h1>Bourges 2028 — Administration</h1>
      </header> */}

      <div className="admin-content">
        <nav className="admin-sidebar">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className={pathname === item.path ? "active" : ""}>
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="admin-main">
          <div className="admin-top-content">
            <h2>Bienvenue sur le panneau d’administration</h2>
            <p>Sélectionnez une section dans le menu de gauche pour commencer.</p>
          </div>
          
          <div className="admin-menu">
              {menuItems.map((item) => (
              <a key={item.path} href={item.path} className="content-bloc">
                <p>{item.name}</p>
                <img src={item.image} alt="image" />
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
