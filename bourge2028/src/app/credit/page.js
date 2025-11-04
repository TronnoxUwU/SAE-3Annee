"use client";

import Topbar from "@/components/Topbar.jsx";
import Styles from "../styles/pages_generales.module.css";

export default function CreditPage() {
  return (
    <>
      <Topbar />
      <div className={Styles.pageContainer}>
        <h1>Crédits</h1>
        <p>Cette application a été développée par une équipe d'étudiants de l'IUT d'Orléans.</p>
        <p>Développement : Tristan CHALOINE, Baptiste RICHARD, Shanka CLERMONT</p>
        <p>Remerciements : Professeurs et intervenants de l'IUT d'Orléans.</p>
        <p>Images et ressources utilisées sous licence Creative Commons.</p>
      </div>
    </>
  );
}
