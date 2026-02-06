import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Style from "./apercu_point.module.css";

export default function ApercuPoint({ id, type, onClose }) {
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
        <>
        <div className={Style["apercu-point"]}>
        <div className={Style["apercu-content"]}>

            <div className={Style["apercu-point-header"]}>
                <h3 className={Style["apercu-title"]}>
                    {type === "structure" ? pointData.nomStructure : pointData.nomProjet}
                </h3>
                <button className={Style["apercu-close"]} onClick={onClose}>
                    ✕
                </button>
            </div>

            <span className={Style["apercu-label"]}>
                {type === "structure" ? "Structure" : "Projet"}
            </span>
            

            {type === "structure" && (
            <>
                <p className={Style["apercu-description"]}>
                {pointData.description}
                </p>
                <p className={Style["apercu-meta"]}>
                {pointData.adresse}
                </p>
            </>
            )}

            {type === "projet" && (
            <p className={Style["apercu-description"]}>
                {pointData.realisation?.description}
            </p>
            )}

            <a
            className={Style["apercu-link"]}
            href={
                type === "structure"
                ? `/structure/${pointData.id}`
                : `/annuaires/projets/${pointData.realisation?.id}`
            }
            >
            Voir la fiche complète →
            </a>
        </div>

        <div className={Style["apercu-image"]}>
            <img src={imageSrc} alt="" />
        </div>
        </div>
        </>
    );
}