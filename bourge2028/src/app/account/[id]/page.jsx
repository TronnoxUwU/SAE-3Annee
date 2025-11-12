"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Styles from "./Account.module.css";
import Topbar from "@/components/Topbar";
import Structure from "@/components/structures-list/affichage-structure";
import UserInfo from "./components/userinfo";
import UserEdit from "./components/UserEdit";

export default function AccountPage() {
  const { data: session, update } = useSession();
  const router = useRouter()
  const params = useParams();
  const userId = parseInt(params.id);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Vérifier l'authentification
  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/");
  //   }
  // }, [status, router]);

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

  // Vérifier que l'utilisateur connecté peut modifier ce compte
  const canEdit =
    session?.user?.id === userId || session?.user?.role === "Admin";

  const handleSave = async (dataToSend) => {
    try {
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
      else {
        const updatedUser = await response.json();

        setUser(updatedUser);

        setIsEditing(false);
        alert("Profil mis à jour avec succès !");

        // 
        //  MISE A JOUR DU TOKEN
        // 

        const refresh = await fetch("/api/auth/refresh");
        if (!refresh.ok) {
          alert("Erreur de rafraîchissement de session");
          return;
        }

        const newUser = await refresh.json();

        await update({
          ...session,
          user: {
            ...session.user,
            ...newUser,
          },
        });
      }
      
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <>
        <Topbar title="Chargement du compte" />
        <div className={Styles.container}>
          <div className="d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="text-muted">Chargement des données...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Topbar title="Erreur" />
        <div className={Styles.container}>
          <p className={Styles.error}>{error || "Utilisateur non trouvé"}</p>
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

          {/* Affichage ou édition */}
          {!isEditing ? (
            <UserInfo
              user={user}
              canEdit={canEdit}
              onEdit={() => setIsEditing(true)}
            />
          ) : (
            <UserEdit
              user={user}
              onCancel={handleCancel}
              onSave={handleSave}
            />
          )}
        </div>

        <div className={Styles.structures}>
          <h2>
            {canEdit ? "Mes structures" : `Structures de ${user.prenom}`}
          </h2>

          <Structure />
        </div>
      </div>
    </>
  );
}