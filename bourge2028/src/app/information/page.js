"use client";

import Topbar from "@/components/Topbar.jsx";
import style from "@/styles/main/pages_generales.module.css";

export default function InformationPage() {
  return (
    <>
      <Topbar />

      <img
          src="/images/chevale.png"
          alt="background image"
          className={style.showImageFull}
      />
      
      <main className={`${style.transparent} container my-5 p-0`}>
        <div className={`${style.transparent} card shadow-sm mb-4`}>
          <div className="card-body p-0">
            <div className="card-header"><h1 className="card-title p-2">Informations du site</h1></div>


          <section className="p-4">
            <h2 className="h4">Cette page n'est plus à jour</h2>
            <p>
              Vous avez une quoicouphoto de cheval en fond<br></br>
              Umamuslime ugly derby
            </p>
          </section>
        </div>
        </div>
        </main>
    </>
  );
}
