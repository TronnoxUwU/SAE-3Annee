import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./apercu_point.css";

export default function ApercuPoint({ id, type }) {
    const router = useRouter();
    const [pointData, setPointData] = useState(null);
    useEffect(() => {
        switch (type) {
            case "structure":
                fetch(`/api/structures/${id}`)
                    .then((res) => res.json())
                    .then((data) => setPointData(data))
                    .catch((err) => console.error("Erreur chargement structure:", err));
                break;
            case "realisation":
                fetch(`/api/realisations/${id}`)
                    .then((res) => res.json())
                    .then((data) => setPointData(data))
                    .catch((err) => console.error("Erreur chargement réalisation:", err));
                break;
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
            ) : type === "realisation" ? (
                <div>
                    <h3>{pointData.titre}</h3>
                    <p>{pointData.resume}</p>
                </div>
            ) : null}
        </div>
    );
}