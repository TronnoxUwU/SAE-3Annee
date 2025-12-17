import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./apercu_point.css";

export default function ApercuPoint({ id, type }) {
    const router = useRouter();
    const [pointData, setPointData] = useState(null);
    useEffect(() => {
        switch (type) {
            case "structure":
                let structId = id.replace("struct_", "");
                fetch(`/api/structures/${structId}`)
                    .then((res) => res.json())
                    .then((data) => setPointData(data))
                    .catch((err) => console.error("Erreur chargement structure:", err));
                break;
            case "projet":
                let realId = id.replace("projet_", "");
                fetch(`/api/projets/${realId}`)
                    .then((res) => res.json())
                    .then((data) => setPointData(data))
                    .catch((err) => console.error("Erreur chargement réalisation:", err));                break;
            default:
                console.error("Type de point inconnu:", type);
        }
    }, [id, type]);

    if (!pointData) return null;



    return (
        <div className="apercu-point">
            {type === "structure" ? (
                <div>
                    <h3>{pointData.nomStructure}</h3>
                    <img src={pointData.lienPhoto} alt={pointData.nomStructure} />
                    <p>{pointData.description}</p>
                    <p>{pointData.adresse}</p>
                    <a href={`/structure/${pointData.id}`}>Voir la fiche complète</a>
                </div>
            ) : type === "projet" ? (
                <div>
                    <h3>{pointData.realisation.nom}</h3>
                    <p>{pointData.realisation.description}</p>
                    <a href={`annuaires/projets/${pointData.realisation.id}`}>Voir la fiche complète</a>
                </div>
            ) : null}
        </div>
    );
}