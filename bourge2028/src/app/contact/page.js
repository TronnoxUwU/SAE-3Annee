"use client";

import Topbar from "@/components/Topbar.jsx";
import style from "@/styles/main/pages_generales.module.css";

export default function ContactPage() {
  return (
    <>
      <Topbar />
      
      <img
          src="/images/region-min.png"
          alt="background image"
          className={style.showImage}
      />
      
      <main className="container my-5">
        <div className="card shadow-sm mb-4">
          <div className="card-body p-0">
            <div className="card-header"><h1 className="card-title p-2">Mentions légales</h1></div>


          <section className="p-4">
            <h2 className="h4">Contacts Bourges 2028</h2>
            <p>
              contact@bourges2028.org<br></br>
              02 48 68 22 81<br></br>
              36 rue Moyenne<br></br>
              18000 Bourges<br></br>
              Horaires d'accueil du local :<br></br>
              Du mardi au samedi<br></br>
              De 10h à 13h et de 14h à 17h
            </p>
          </section>
        </div>
        </div>
        </main>
    </>
  );
}
