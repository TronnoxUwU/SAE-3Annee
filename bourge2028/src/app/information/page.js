"use client";

import Topbar from "@/components/Topbar.jsx";
import Styles from "../styles/pages_generales.module.css";

export default function InformationPage() {
  return (
    <>
      <Topbar />
      <div className={Styles.pageContainer}>
        <h1>Informations</h1>
        <p>Bienvenue sur la page d'informations de l'application Bourges 2028.</p>
        <p>Vous y trouverez des détails sur les fonctionnalités, les mises à jour et les ressources disponibles.</p>
      </div>
    </>
  );
}
