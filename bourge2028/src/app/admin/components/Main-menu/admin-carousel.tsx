"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import Style from "./admin-carousel.module.css";

export default function AdminMenu() {

    const pathname = usePathname();
    const menuItems = [
        { name: "Acceuil admin", path: "/admin", image: "/images/admin.png"},
        { name: "Dashboard", path: "/admin/dashboard", image: "/images/data.png" },
        { name: "Catégories", path: "/admin/categories", image: "/images/categorie.png" },
        { name: "Structures", path: "/admin/structures", image: "/images/structure.png" },
    ];

    return (
        <div className={Style.admin_menu}>
            {menuItems.map((item) => (
              item.image && (
                <a key={item.path} href={item.path} className={Style.content_bloc}>
                  <p>{item.name}</p>
                  <img src={item.image} alt={item.name} />
                </a>
              )
            ))}
          </div>
    );
}
