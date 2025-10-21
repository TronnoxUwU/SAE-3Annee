import React from "react";
import Styles from "./Topbar.module.css";

export default function Topbar({ title = "Bourges 2028", fixed = false }) {
  return (
    <header
      className={`${Styles.topbar} ${
        fixed ? Styles.topbar_fixed : Styles.topbar_bloc
      }`}
    >
      <h1>{title}</h1>
      <a className={Styles.connect} href="">
        <img src="/images/tete.png" alt="tete" />
        <p>Se connecter</p>
      </a>
    </header>
  );
}
