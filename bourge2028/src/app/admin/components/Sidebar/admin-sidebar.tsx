"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import styles from "./admin-sidebar.module.css";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Accueil", path: "/admin", icon: "bi-house-door" },
    { name: "Dashboard", path: "/admin/dashboard", icon: "bi-speedometer2" },
    { name: "Catégories", path: "/admin/categories", icon: "bi-tags" },
    { name: "Structures", path: "/admin/structures", icon: "bi-diagram-3" },
    { name: "Créations en attente", path: "/admin/waiting", icon: "bi-hourglass-split" },
    { name: "Comptes", path: "/admin/accounts", icon: "bi-people" },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* <div className={styles.header}>
        <span className={styles.logo}>Admin</span>
      </div> */}

      <ul className={styles.menu}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
              >
                <i className={`bi ${item.icon} ${styles.icon}`} />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
