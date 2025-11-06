"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import Styles from "./admin-sidebar.module.css";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Acceuil", path: "/admin" },
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Catégories", path: "/admin/categories" },
    { name: "Structures", path: "/admin/structures" },
  ];

  return (
    <nav className={Styles.admin_sidebar}>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={pathname === item.path ? Styles.active : ""}
          >
            <Link href={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
