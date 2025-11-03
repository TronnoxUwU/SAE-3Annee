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

  // add
  function handleAdd(newCat) {

    setItems(prev => addRecursive(prev, newCat));

    function addRecursive(categories, addCat) {
      return categories.map(cat =>
        cat.id === addCat.parentId
          ? { ...cat, children: [...(cat.children || []), addCat] }
          : { ...cat, children: addRecursive(cat.children || [], addCat) }
      );
    }

  }

  // update
  function handleUpdate(updatedCat) {

    setItems(prev => updtRecursive(prev, updatedCat));

    function updtRecursive(categories, updatedCat) {
      return categories.map(cat =>
        cat.id === updatedCat.id
          ? { ...cat, ...updatedCat }
          : { ...cat, children: updtRecursive(cat.children || [], updatedCat) }
      );
    }

  }

  // delete
  function handleDelete(id) {

    setItems(prev => rmvRecursive(prev, id));

    function rmvRecursive(categories, idRmv) {
      return categories
        .filter(cat => cat.id !== idRmv)
        .map(cat => ({
          ...cat,
          children: rmvRecursive(cat.children || [], idRmv),
        }));
    }

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
