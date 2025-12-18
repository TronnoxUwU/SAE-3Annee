import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./apercu_point.css";

export default function ApercuPoint({ id, type }) {
    const router = useRouter();
    const [pointData, setPointData] = useState(null);
    const [imageSrc, setImageSrc] = useState("/images/default-article.png");
    const originalSrc = pointData?.lienPhoto || "/images/default-article.png";

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
                    .catch((err) => console.error("Erreur chargement réalisation:", err)); break;
            default:
                console.error("Type de point inconnu:", type);
        }
    }, [id, type]);

    useEffect(() => {
        let canceled = false;

        async function preloadImage(url) {
            try {
                const img = new Image();
                img.src = url;

                const result = await new Promise((resolve, reject) => {
                    const timeout = setTimeout(
                        () => reject(new Error("Timeout de chargement")),
                        4000
                    );
                    img.onload = () => {
                        clearTimeout(timeout);
                        resolve(true);
                    };
                    img.onerror = () => {
                        clearTimeout(timeout);
                        reject(new Error("Erreur de chargement"));
                    };
                });



                if (!canceled && result) setImageSrc(url);
            } catch {
                if (!canceled) setImageSrc("/images/default-article.png");
            }
        }

        preloadImage(originalSrc);
        return () => {
            canceled = true;
        };
    }, [originalSrc]);

    if (!pointData) return null;

    return (
        <div className="apercu-point">
            {type === "structure" ? (
                <div>
                    <h3>{pointData.nomStructure}</h3>
                    <div className="apercu-point-image-container">
                        <img src={imageSrc} alt={pointData.nomStructure} />
                    </div>
                    <p>{pointData.description}</p>
                    <p>{pointData.adresse}</p>
                    <a href={`/structure/${pointData.id}`}>Voir la fiche complète</a>
                </div>
            ) : type === "projet" ? (
                <div>
                    <h3>{pointData.nomProjet}</h3>
                    <p>{pointData.realisation?.description}</p>
                    <a href={`annuaires/projets/${pointData.realisation?.id}`}>Voir la fiche complète</a>
                </div>
            ) : null}
        </div>
    );
}