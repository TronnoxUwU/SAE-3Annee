"use client";

import { useEffect, useState } from "react";
import Style from "./carte-item.module.css";

interface CarteItemProps {
  id: number;
  titre?: string;
  descriptionCarte?: string;
  lienCarte?: string;
  validate?: boolean;
  onValidate?: (id: number) => void;
  onRefuse?: (id: number) => void;
}

const CarteItem = ({id, titre, descriptionCarte, lienCarte, validate = false, onValidate, onRefuse}: CarteItemProps) => {
  const [imageSrc, setImageSrc] = useState("/images/default-article.png");

  const originalSrc = "/images/default-article.png";
  const title = titre || "Carte sans titre";

  // ------------------------------
  // PRELOAD IMAGE (obligatoire)
  // ------------------------------
  async function preloadImage(url) {
    try {
      const img = new Image();
      img.src = url;

      const loaded = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(), 4000);

        img.onload = () => {
          clearTimeout(timeout);
          resolve(true);
        };

        img.onerror = () => {
          clearTimeout(timeout);
          reject();
        };
      });

      if (loaded) {
        setImageSrc(url);
      }
    } catch {
      setImageSrc("/images/default-article.png");
    }
  }

  // ------------------------------
  // FETCH OG IMAGE depuis ton API
  // ------------------------------
  async function getOgImage(url) {
    try {
      const res = await fetch("/api/ogimage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      return data.image || null;
    } catch {
      return null;
    }
  }

  // ------------------------------
  // LOAD IMAGE PRINCIPALE
  // ------------------------------
  useEffect(() => {
    let canceled = false;

    async function loadImage() {
      // 1. Cherche og:image (Discord style)
      const og = await getOgImage(lienCarte);

      if (og && !canceled) {
        preloadImage(og);
        return;
      }

      // 2. Sinon → image interne par défaut
      preloadImage(originalSrc);
    }

    loadImage();
    return () => {
      canceled = true;
    };
  }, [lienCarte]);

  return (
    <li className={`card p-0 ${Style.item_bloc}`}>
      {/* HEADER */}
      <div className={`${Style.card_header} card-header fs-4`}>
        {title}

        <div className="btn-group btn-group-sm" role="group">
            {/* VALIDATION */}
            {validate && (
              <button
                className={`${Style.btn_crud} btn btn-outline-warning text-dark btn-sm px-3`}
                title="Valider la structure"
                onClick={() => onValidate?.(id)}
              >
                Valider
                <i className="bi bi-check-lg fs-5"></i>
              </button>
            )}

            {/* REFUS */}
            {validate && (
              <button
                className={`${Style.btn_crud} btn btn-outline-danger text-dark btn-sm px-3`}
                title="Refuser la structure"
                onClick={() => onRefuse?.(id)}
              >
                Refuser
                <i className="bi bi-x-lg fs-6"></i>
              </button>
            )}
          </div>
      </div>

      {/* BODY */}
      <div className={`${Style.card_body} card-body`}>
        <img src={imageSrc} alt={title} className={Style.apercuArticleImage} />

        <div className={Style.card_content}>
          <a
            className={Style.card_link}
            href={/^https?:\/\//.test(lienCarte) ? lienCarte : `https://${lienCarte}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-box-arrow-up-right"></i> {lienCarte || "Aucun lien fourni"}
          </a>

          <p className={Style.card_desc}>
            {descriptionCarte || "Aucune description"}
          </p>
        </div>
      </div>
    </li>
  );
};

export default CarteItem;
