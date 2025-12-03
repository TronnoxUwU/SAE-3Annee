import React from "react";
import Styles from "../account.module.css";

export default function UserInfo({ user, canEdit, onEdit }) {
  return (
    <div className={Styles.infoSection}>
      <h2>
        {user.prenom} {user.nom}
      </h2>
      <p className={Styles.role}>{user.role !== "User" || "Membre"}</p>

      <div className={Styles.details}>

        {canEdit && (
          <div className={Styles.field}>
            <strong>Identifiant :</strong>
            <span>{user.identifiant}</span>
          </div>
        )}

        {canEdit && (
          <div className={Styles.field}>
            <strong>Email :</strong>
            <span>{user.email}</span>
          </div>
        )}
        
        <div className={Styles.field}>
          <strong>Description :</strong>
          <span>{user.description}</span>
        </div>

        {user.departement && (
          <div className={Styles.field}>
            <strong>Département :</strong>
            <span>{user.departement.nom}</span>
          </div>
        )}

        {user.redactions && user.redactions.length > 0 && (
          <div className={Styles.field}>
            <strong>Articles rédigés :</strong>
            <span>{user.redactions.length} article(s)</span>
          </div>
        )}

        <div className={Styles.field}>
          <strong>Membre depuis :</strong>
          <span>
            {new Date(user.dateCreation).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {canEdit && (
        <button className={Styles.editButton} onClick={onEdit}>
          Modifier le profil
        </button>
      )}
    </div>
  );
}