"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Styles from "./Account.module.css";
import Topbar from "@/components/Topbar";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.id);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Vérifier l'authentification
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Charger les données utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Utilisateur non trouvé");
        }
        const data = await response.json();
        setUser(data);
        setFormData({
          nom: data.nom || "",
          prenom: data.prenom || "",
          email: data.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Vérifier que l'utilisateur connecté peut voir ce compte
  const canEdit =
    session?.user?.id === userId || session?.user?.role === "Admin";

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

    try {
      const dataToSend = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
      };

      if (isChangingPassword && formData.newPassword) {
        dataToSend.currentPassword = formData.currentPassword;
        dataToSend.newPassword = formData.newPassword;
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      setIsChangingPassword(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Profil mis à jour avec succès !");
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  if (loading) {
    return (
      <>
        <Topbar title="Chargement..." />
        <div className={Styles.container}>
          <p>Chargement...</p>
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Topbar title="Erreur" />
        <div className={Styles.container}>
          <p className={Styles.error}>
            {error || "Utilisateur non trouvé"}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title={`Profil de ${user.prenom} ${user.nom}`} />
      <div className={Styles.container}>
        <div className={Styles.profileCard}>
          {/* Avatar */}
          <div className={Styles.avatarSection}>
            <div className={Styles.avatar}>
              <div className={Styles.defaultAvatar}>
                {user.prenom?.[0]}
                {user.nom?.[0]}
              </div>
            </div>
          </div>

          {/* Informations */}
          {!isEditing ? (
            <div className={Styles.infoSection}>
              <h2>
                {user.prenom} {user.nom}
              </h2>
              <p className={Styles.role}>{user.role || "Membre"}</p>

              <div className={Styles.details}>
                <div className={Styles.field}>
                  <strong>Identifiant :</strong>
                  <span>{user.identifiant}</span>
                </div>
                <div className={Styles.field}>
                  <strong>Email :</strong>
                  <span>{user.email}</span>
                </div>
                {user.departement && (
                  <div className={Styles.field}>
                    <strong>Département :</strong>
                    <span>{user.departement.nom}</span>
                  </div>
                )}
                {user.structures && user.structures.length > 0 && (
                  <div className={Styles.field}>
                    <strong>Structures :</strong>
                    <div className={Styles.structuresList}>
                      {user.structures.map((app) => (
                        <a
                          key={app.id}
                          href={`/structure/${app.structureId}`}
                          className={Styles.structureLink}
                        >
                          {app.structure.nomStructure}
                          {app.role && ` (${app.role})`}
                        </a>
                      ))}
                    </div>
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
                    {new Date(user.dateCreation).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              {canEdit && (
                <button
                  className={Styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Modifier le profil
                </button>
              )}
            </div>
          ) : (
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
                      <label htmlFor="currentPassword">
                        Mot de passe actuel
                      </label>
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
                      <label htmlFor="confirmPassword">
                        Confirmer le mot de passe
                      </label>
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
                  onClick={() => {
                    setIsEditing(false);
                    setIsChangingPassword(false);
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
