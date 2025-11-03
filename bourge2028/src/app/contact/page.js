"use client";

import Topbar from "@/components/Topbar.jsx";
import Styles from "../styles/pages_generales.module.css";

export default function ContactPage() {
  return (
    <>
      <Topbar />
      <div className={Styles.pageContainer}>
        <h1>Contactez-nous</h1>
        <p>Pour toute question ou demande, n'hésitez pas à nous contacter à l'adresse suivante :</p>
        <p>Email : contact@bourges2028.fr</p>
      </div>
    </>
  );
}
