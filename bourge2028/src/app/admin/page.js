"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./styles/admin.css";

export default function AdminPage() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Catégories", path: "/admin/categories" },
    { name: "Structures", path: "/admin/structures" },
  ];

  return (
    <div className="admin-container">
      <header className="admin-topbar">
        <h1>Bourges 2028 — Administration</h1>
      </header>

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
          <h2>Bienvenue sur le panneau d’administration</h2>
          <p>Sélectionnez une section dans le menu de gauche pour commencer.</p>
        </main>
      </div>
    </div>
  );
}
