"use client";

import { useEffect, useState } from "react";
import StructureItem from "./structure-Item";

export default function AdminStructure() {
  const [items, setItems] = useState([]);

  async function loadCategories() {
    const res = await fetch("/api/structures");
    const data = await res.json();
    console.log(data);
    setItems(data);
  }

  useEffect(() => { loadCategories(); }, []);

  return (
    <ul >
      {items.map(item => {
        return (
          <StructureItem
            key={item.id}
            id={item.id}
            nom={item.nomStructure}
            date={item.dateCreation}
          />
        );
      })}
    </ul>
  );

}