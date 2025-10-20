import React from "react";
import "../styles/Topbar.css";

export default function Topbar({ title = "Bourges 2028", fixed = false }) {
  return (
    <header className={`topbar ${fixed ? "topbar-fixed" : "topbar-bloc"}`}>
      <h1>{title}</h1>
      <a className="connect" href="">
        <img src="/images/tete.png" alt="tete" />
        <p>Se connecter</p>
      </a>
    </header>
  );
}
