"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import "../styles/admin.css";

export default function AdminMenu() {

    const pathname = usePathname();
    const menuItems = [
        { name: "Acceuil admin", path: "/admin", image: "/images/data.png"},
        { name: "Dashboard", path: "/admin/dashboard", image: "/images/data.png" },
        { name: "Catégories", path: "/admin/categories", image: "/images/categorie.png" },
        { name: "Structures", path: "/admin/structures", image: "/images/structure.png" },
    ];

    return (
        <div className="admin-menu">
            {menuItems.map((item) => (
              item.image && (
                <a key={item.path} href={item.path} className="content-bloc">
                  <p>{item.name}</p>
                  <img src={item.image} alt={item.name} />
                </a>
              )
            ))}
          </div>
    );
}
