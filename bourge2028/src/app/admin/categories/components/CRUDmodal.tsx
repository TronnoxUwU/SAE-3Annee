"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import Style from "./crudModal.module.css"
import { revalidateTag } from "next/cache";

export default function CatCrudModal({ CRUD, isOpen, onClose, selfId, name, onAdd, onUpdate, onDelete }) {

  const [nom, setNom] = useState("");

  const handleClose = () => {
    setNom("");
    onClose();
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nom,
        parentId: selfId
      })
    });
    const newCat = await res.json();
    console.log(newCat)
    if(res.status.toString().startsWith("20")){
      onAdd(newCat);
    }
    else{/* Faire une popup fail */}

    handleClose();
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/categories/${selfId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nom
      })
    });
    const newCat = await res.json();
    console.log(newCat)
    if(res.status.toString().startsWith("20")){
      onUpdate(newCat);
    }
    else{/* Faire une popup fail */}

    handleClose();
  };

  const handleSubmitDelete = async (e) => {
    e.preventDefault();
    console.log(parent)

    const res = await fetch(`/api/categories/${selfId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const newCat = await res.json();
    console.log(newCat)
    if(res.status.toString().startsWith("20")){
      onDelete(newCat.id);
    }
    else{/* Faire une popup fail */}

    handleClose();
  };

  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <>
        {/* <h2>Ajouter une catégorie</h2> */}
        {CRUD === "UPDATE"
          ? <h2>Modifiez le nom de cette catégorie</h2>
          : CRUD === "DELETE"
          ? <h2>Voulez-vous supprimer cette catégorie ?</h2>
          : <h2>Ajouter une catégorie</h2>
        }

        <form className={Style.connect_form}
          onSubmit={
            CRUD === "UPDATE"
              ? handleSubmitUpdate
              : CRUD === "DELETE"
              ? handleSubmitDelete
              : handleSubmitAdd
          }
        >

        {/* <form onSubmit={handleSubmitAdd} className={Style.connect_form}> */}
          
          {CRUD !== "DELETE"
            ?<input
                type="text"
                placeholder="Nom de votre catégorie"
                value={nom!=="" ? nom : name}
                onChange={(e) => setNom(e.target.value)}
              />
            : <></>
          }

          <button className="btn btn-primary" type="submit">
            {CRUD === "UPDATE"
              ? "Modifier cette catégorie"
              : CRUD === "DELETE"
              ? "Confirmer la suppression"
              : "Ajouter la catégorie"
            }
          </button>

          <button
            className={`btn btn-danger ${Style.forget}`}
            type="button"
            onClick={onClose}
          >
            Annuler
          </button>
        </form>
      </>
    </Modal>
  );
}
