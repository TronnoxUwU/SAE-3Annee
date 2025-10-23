"use client";

import { useEffect, useState } from "react";
import ListItem from "./listItem"

export default function AdminCategory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/categories");

      if (!res.ok) {
        console.error("Erreur fetch categories :", res.status);
        return;
      }

      const data = await res.json();
      setItems(data);
    }

    loadCategories();
  }, []);

  return (
    <div>
      {items.map(item => {
        return (
          <ListItem
            key={item.id}
            id={item.id}
            nom={item.nom}
            parent={item.parentId}
          />
        );
      })}
    </div>
  );
}
