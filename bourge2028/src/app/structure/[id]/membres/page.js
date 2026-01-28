"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Topbar from "@/components/Topbar.jsx";
import Style from "../page.module.css";


export default function MembersPage() {

    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [structure, setStructure] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roles, setRoles] = useState([]);

    const canHandleMembers = () => {
        if (!session || !structure) return false;
        for (const member of structure.personnes) {
            // console.log("Vérification du membre :", member);
            // console.log("Session utilisateur :", session.user);
            if ((member.personneId === session.user.id && (member.nomRole === "Proprietaire") || session.user.role === "Admin")) {
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        const fetchStructure = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/structures/${params.id}`);

                if (!response.ok) {
                    throw new Error("Structure non trouvée");
                }

                const data = await response.json();
                // console.log("Données de la structure récupérées :", data);
                setStructure(data);

                const res = await fetch('/api/role');
                if (!res.ok) {
                    throw new Error("Erreur lors de la récupération des rôles");
                }
                const rolesData = await res.json();
                // console.log("Rôles récupérés :", rolesData);
                setRoles(rolesData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchStructure();
        }
    }, [params.id]);

    const handleSubmit = async (e, personneId, selectedRoleId) => {
        e.preventDefault();
        try {
            const body = { roleId: selectedRoleId };
            console.log("Body à envoyer:", JSON.stringify(body));

            const res = await fetch(`/api/structures/${params.id}/members/${personneId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            console.log("Status de la réponse:", res.status);

            const data = await res.json();
            console.log("Réponse complète:", data);

            if (!res.ok) {
                console.error("Erreur API:", data);
                throw new Error(data.error || "Erreur API");
            }

            alert("Rôle mis à jour avec succès");

        } catch (err) {
            console.error("Erreur lors de la mise à jour:", err);
            alert("Erreur lors de la mise à jour du rôle");
        }
    };

    const handleDelete = async (personneId) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
            return;
        }

        try {
            const res = await fetch(`/api/structures/${params.id}/members/${personneId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Erreur API:", data);
                throw new Error(data.error || "Erreur API");
            }

            // Mettre à jour l'état local pour retirer le membre supprimé
            setStructure(prev => ({
                ...prev,
                personnes: prev.personnes.filter(p => p.personneId !== personneId)
            }));

            alert("Membre supprimé avec succès");

        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            alert("Erreur lors de la suppression du membre");
        }
    };

    const handleAjout = () => {
        // show popup d'ajout de membre (à implémenter)
    }

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    return (
        <>
            <Topbar />
            <div className={Style.userPage}>
                {/* Navigation */}
                <div className={Style.navBar}>
                    <a
                        className={`${Style.btn_back} btn btn-link`}
                        href={`/structure/${params.id}`}
                        title="Retour"
                    >
                        <i className="bi bi-chevron-left"></i> Retour
                    </a>
                    {canHandleMembers() && (
                        <button
                            className={`${Style.btn_add} btn btn-outline-secondary`}
                            onClick={handleAjout}
                            title="Ajouter un membre"
                        >
                            <i className="bi bi-plus-square"></i> Ajouter un membre
                        </button>
                    )}
                </div>
                <div className={Style.membersSection}>
                    <div className={Style.sectionHeader}>
                        <span className={Style.label}>Nos membres</span>
                    </div>
                    <div className={Style.membersList}>
                        {structure?.personnes && structure.personnes.length > 0 ? (
                            structure.personnes.map((member) => (
                                <div key={member.id} className={Style.memberCard}>
                                    <div className={Style.avatarSection}>
                                        <div className={Style.avatar}>
                                            <div className={Style.defaultAvatar}>
                                                {member.prenom?.[0]}
                                                {member.nom?.[0]}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={Style.memberInfo}>
                                        <h3 className={Style.memberName}>{member.nom} {member.prenom}</h3>
                                        <p className={Style.memberRole}>{member.nomRole}</p>
                                        {canHandleMembers() && roles.length > 0 && (
                                            <>
                                                <form
                                                    onSubmit={(e) => handleSubmit(e, member.personneId, member.role)}
                                                >
                                                    <select
                                                        className={Style.roleSelect}
                                                        defaultValue={member.role} // Utiliser roleId au lieu de nomRole
                                                        onChange={(e) => {
                                                            const selectedRoleId = e.target.value; // Récupère l'id du rôle
                                                            const selectedRole = roles.find(r => r.id === parseInt(selectedRoleId));

                                                            setStructure(prev => ({
                                                                ...prev,
                                                                personnes: prev.personnes.map(p =>
                                                                    p.personneId === member.personneId
                                                                        ? { ...p, role: parseInt(selectedRoleId), nomRole: selectedRole?.nom }
                                                                        : p
                                                                )
                                                            }))
                                                        }}
                                                    >
                                                        {roles.map((role) => (
                                                            <option key={role.id} value={role.id}> {/* value doit être l'id */}
                                                                {role.nom}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <input type="hidden" name="memberId" value={member.personneId} />
                                                    <button type="submit" className={Style.btn_save}>
                                                        Sauvegarder
                                                    </button>
                                                </form>
                                                <button className={Style.btn_delete} onClick={() => handleDelete(member.personneId)}>Supprimer</button>
                                            </>)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={Style.noMembers}>Aucun membre répertorié pour cette structure.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}