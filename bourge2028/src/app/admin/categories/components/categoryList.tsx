"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ListItem from "./listItem"
import CatCrudModal from "./CRUDmodal";

export default function AdminCategory() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { 
    try {
      setLoading(true);
      loadCategories(); 
    } catch (err) {
      setError(err.message);
    }

  }, []);

  if (loading) {
    return (
      <>
        {/* <div className={Style.userPage}> */}
        <div>
          <p>Chargement...</p>
        </div>
      </>
    );
  }

  if (error) {
      return (
        <>
          {/* <div className={Style.userPage}> */}
          <div>
            <h1>Erreur</h1>
            <p>{error}</p>
            <button onClick={() => router.push("/admin")}>
              Retour aux structures
            </button>
          </div>
        </>
      );
    }

  // add
  function handleAdd(newCat) {

    if(newCat.parentId === null) {setItems(prev => [...prev, newCat]);}
    else {
      setItems(prev => addRecursive(prev, newCat));

      function addRecursive(categories, addCat) {
        return categories.map(cat =>
          cat.id === addCat.parentId
            ? { ...cat, children: [...(cat.children || []), addCat] }
            : { ...cat, children: addRecursive(cat.children || [], addCat) }
        );
      }
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
      <>

      <button
        className="btn btn-outline-success btn-sm mb-4 fs-5"
        title="Ajouter"
        onClick={() => setOpenAddModal(true) }
      >
        <i className="bi bi-plus fs-5"></i>
        Ajouter une catégorie
      </button>

    <CatCrudModal
        CRUD={"ADD"}
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        selfId={null}
        name={""}
        onAdd={handleAdd}
        onUpdate={null}
        onDelete={null} 
    />
    
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
    </>
  );
}
