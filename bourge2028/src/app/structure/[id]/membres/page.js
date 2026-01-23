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
            console.log("Vérification du membre :", member);
            console.log("Session utilisateur :", session.user);
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

    const handleSubmit = async (e, memberId, selectedRole) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/structures/${params.id}/members/${memberId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nomRole: selectedRole }),
            });

            if (!res.ok) {
                throw new Error("Erreur API");
            }

        } catch (err) {
            console.error(err);
        }
    };

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
                                        {/* <p className={Style.memberRole}>{member.nomRole}</p> */}
                                        {canHandleMembers() && roles.length > 0 && (
                                            <form 
                                            // onSubmit={(e) => handleSubmit(e, member.id, member.nomRole)}
                                            >
                                                <select
                                                    className={Style.roleSelect}
                                                    defaultValue={member.nomRole}
                                                    onChange={(e) =>
                                                        setStructure(prev => ({
                                                            ...prev,
                                                            personnes: prev.personnes.map(p =>
                                                                p.id === member.id ? { ...p, nomRole: e.target.value } : p
                                                            )
                                                        }))
                                                    }
                                                >
                                                    {roles.map((role) => (
                                                        <option key={role.id} value={role.nom}>
                                                            {role.nom}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input type="hidden" name="memberId" value={member.id} />
                                                <button type="submit" className={Style.btn_save}>
                                                    Sauvegarder
                                                </button>
                                            </form>
                                        )}
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