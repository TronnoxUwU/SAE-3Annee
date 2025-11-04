"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Topbar from "@/components/Topbar.jsx";
import Style from "../styles/user.module.css";

export default function ProjetsPage() {
  const router = useRouter();
  const [images, setImages] = useState({
    article: "/images/default-article.png",
    localisation: "/images/localisation.png",
  });

  const handleRedirectProjet = () => {
    router.push("/structure/projets");
  };

  const handleImageError = (key) => {
    setImages((prev) => ({
      ...prev,
      [key]: "/images/default-article.png",
    }));
  };

  return (
    <>
      <Topbar />
      <div className={Style.userPage}>
        <h1>Ma Structure</h1>
        <div className={Style.conteneur}>
          <div className={Style.card} onClick={handleRedirectProjet}>
            <img
              src={images.article}
              alt="Article"
              onError={() => handleImageError("article")}
            />
            <h2>Mes Articles</h2>
          </div>

          <div className={Style.card}>
            <img
              src={images.localisation}
              alt="Localisation"
              onError={() => handleImageError("localisation")}
            />
            <h2>Mes Localisations</h2>
          </div>
        </div>
      </div>
    </>
  );
}
