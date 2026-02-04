"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import ApercuArticle from "@/components/annuaire/ApercuArticle";
import StructureItem from "@/components/structures-list/structure-Item-pretty";
import Topbar from "@/components/Topbar.jsx";

import Style from "./projet.module.css";

export default function ProjetView({ id, type }) {
  const [data, setData] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    async function load() {
      try {
        const res =
          type === "projet"
            ? await fetch(`/api/projets/${id}`)
            : await fetch(`/api/techniques/${id}`);

        if (res.status === 404) {
          router.push("/404");
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [id, type]);

  if (!data) {
    return;
  }

  const { realisation } = data;
  const articles = realisation.articles || [];
  const collaborateurs = realisation.structure || [];

  const canEdit = () => {
    if (!session) return false;
    if (session.user.role === "Admin") return true;
    return collaborateurs.some(
      (s) => s.id === session.user.structure
    );
  };

  return (
    <>
      <div className={Style.userPage}>

        {/* NAV */}
        <div className={Style.navBar}>
          <a href="/annuaires/projets" className={Style.btn_back}>
            <i className="bi bi-chevron-left" /> Retour
          </a>
        </div>

        {/* HERO */}
        <div className={Style.heroSection}>
          <div className={Style.heroContent}>
            <span className={Style.label}>Projet</span>
            <h1 className={Style.mainTitle}>{data.nomProjet}</h1>
            <p className={Style.description}>
              {realisation.description || "Aucune description disponible"}
            </p>
          </div>

          <img
            src="/images/projet_background_default.jpg"
            alt="illustration projet"
            className={Style.showImage}
          />
        </div>

        {/* ARTICLES */}
        {(articles.length > 0 || canEdit()) && (
          <section className={Style.section}>
            <h2 className={Style.sectionTitle}>
              À propos de ce projet
            </h2>

            <div className={Style.articlesGrid}>
              {articles.map((article) => (
                <ApercuArticle
                  key={article.id}
                  article={article}
                  editable={canEdit()}
                />
              ))}

              {canEdit() && (
                <div
                  className={Style.addCard}
                  onClick={() =>
                    router.push(`${realisation.id}/article`)
                  }
                >
                  <span className={Style.addIcon}>+</span>
                  <span>Ajouter un article</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* COLLABORATEURS */}
        {collaborateurs.length > 0 && (
          <section className={Style.section}>
            <h2 className={Style.sectionTitle}>
              Les collaborateurs
            </h2>

            <div className={Style.collaborateursGrid}>
              {collaborateurs.map((struct) => (
                <StructureItem
                  key={struct.id}
                  id={struct.id}
                  nom={struct.nomStructure}
                  date={struct.dateCreation}
                  description={struct.description}
                  edit={canEdit()}
                  etat="galerie"
                />
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className={Style.footer}>
          <span className={Style.footerLabel}>Projet</span>
          <span className={Style.footerDate}>
            Réalisé par l’équipe
          </span>
        </footer>
      </div>
    </>
  );
}
