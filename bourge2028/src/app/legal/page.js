"use client";

import Topbar from "@/components/Topbar.jsx";
import Styles from "../styles/pages_generales.module.css";

export default function LegalPage() {
  return (
    <>
      <Topbar />
      <div className={Styles.pageContainer}>
        <h1>Mentions légales</h1>
        <p>Cette application est la propriété de l'équipe de développement Bourges 2028.</p>
        <p>Toutes les données collectées sont utilisées conformément à notre politique de confidentialité.</p>
      </div>
    </>
  );
}
