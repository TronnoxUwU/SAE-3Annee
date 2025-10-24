"use client";

import { useEffect, useState } from "react";
import ListItem from "./listItem"

export default function AdminCategory() {
  const [items, setItems] = useState([]);

  async function loadCategories() {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setItems(data);
    }

    useEffect(() => { loadCategories(); }, []);

  // Add
  function handleAdd(newCat) {
    setItems(prev => [...prev, newCat]);
  }

  // Update
  function handleUpdate(updatedCat) {
    setItems(prev =>
      prev.map(item => item.id === updatedCat.id ? updatedCat : item)
    );
  }

  // Delete
  function handleDelete(id) {
    setItems(prev => prev.filter(item => item.id !== id));
  }


  return (
    <ul className="list-group">
      {items.map(item => {
        if (item.parentId) {
          return null;
        };
        return (
          <ListItem
            key={item.id}
            id={item.id}
            nom={item.nom}
            parent={item.parentId}
            childrens={item.children}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        );
      })}
    </ul>
  );
}
