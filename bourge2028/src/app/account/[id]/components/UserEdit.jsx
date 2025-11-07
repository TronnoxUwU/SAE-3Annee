import React, { useState } from "react";
import Styles from "../Account.module.css";

export default function UserEdit({ user, onCancel, onSave }) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: user.nom || "",
    prenom: user.prenom || "",
    email: user.email || "",
    description: user.description || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier les mots de passe si changement
    if (isChangingPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }
      if (!formData.currentPassword) {
        alert("Veuillez entrer votre mot de passe actuel");
        return;
      }
    }

    const dataToSend = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      description: formData.description,
    };

    if (isChangingPassword && formData.newPassword) {
      dataToSend.currentPassword = formData.currentPassword;
      dataToSend.newPassword = formData.newPassword;
    }

    onSave(dataToSend);
  };

  return (
    <form className={Styles.editForm} onSubmit={handleSubmit}>
      <h2>Modifier le profil</h2>

      <div className={Styles.formGroup}>
        <label htmlFor="prenom">Prénom</label>
        <input
          type="text"
          id="prenom"
          name="prenom"
          value={formData.prenom}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={Styles.formGroup}>
        <label htmlFor="nom">Nom</label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={Styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={Styles.formGroup}>
        <label htmlFor="email">Description</label>
        <input
          type="textfield"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={Styles.passwordSection}>
        <button
          type="button"
          className={Styles.togglePassword}
          onClick={() => setIsChangingPassword(!isChangingPassword)}
        >
          {isChangingPassword
            ? "Annuler le changement de mot de passe"
            : "Changer le mot de passe"}
        </button>

        {isChangingPassword && (
          <>
            <div className={Styles.formGroup}>
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required={isChangingPassword}
              />
            </div>

            <div className={Styles.formGroup}>
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required={isChangingPassword}
              />
            </div>

            <div className={Styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={isChangingPassword}
              />
            </div>
          </>
        )}
      </div>

      <div className={Styles.formActions}>
        <button type="submit" className={Styles.saveButton}>
          Enregistrer
        </button>
        <button
          type="button"
          className={Styles.cancelButton}
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
