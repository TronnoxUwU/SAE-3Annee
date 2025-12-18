"use client";

import Topbar from "@/components/Topbar.jsx";
import style from "@/styles/main/pages_generales.module.css";

export default function LegalPage() {
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
            <h2 className="h4">Editeurs du site</h2>
            <p>
              Bourges 2028 : Candidate Capitale européenne de la Culture<br></br>
              Contact : contact@bourges2028.org<br></br>
              Numéro: 02 48 67 58 51<br></br>
              Adresse : 28 rue Gambon, 18000 Bourges<br></br>
              Identification de l’entreprise : Association loi 1901<br></br>
              SIREN : 908 355 811<br></br>
              RNA (répertoire national des associations) : W181008102<br></br>
            </p>
          </section>

          <section className="p-4">
            <h2 className="h4">Créateurs du site</h2>
            <p>Ce site a été réalisé dans le cadre d’un projet universitaire sous l’IUT d’Orléans.</p>
            <p>
            <strong>Membres du projet :</strong><br></br>
            <a className={style.lien} href="www.portfolio.shankaclermont.fr" >Shanka Clermont</a><br></br>
            Baptiste Richard<br></br>
            Tristan Chaloine
            </p>
            <p>
            <strong>Structure de rattachement :</strong><br></br>
            <a className={style.lien} href="https://www.univ-orleans.fr/fr/iut-orleans">IUT d’Orléans</a>
            </p>
          </section>


      <section className="p-4">
          <h2 className="h4">Hébergement temporaire</h2>
          <p><strong>OVHcloud</strong></p>
          <p>
          Centre de données : Strasbourg (France)<br></br>
          OVH SAS – 2 rue Kellermann – 59100 Roubaix – France
          </p>
          </section>


          <section className="p-4">
          <h2 className="h4">Propriété intellectuelle</h2>
          <p>
          L’ensemble des contenus présents sur ce site (textes, images, graphismes, logos, icônes, éléments visuels et structure générale) est protégé par le droit d’auteur et le droit de la propriété intellectuelle.
          </p>
          <p>
          La majorité des images utilisées sont <strong>libres de droits</strong> ou utilisées dans le cadre du <strong>fair use</strong> à des fins pédagogiques et non commerciales.
          </p>
          <p>
          Toute reproduction, représentation, modification ou adaptation de tout ou partie des éléments du site est interdite sans autorisation écrite préalable, sauf dans les cas prévus par la loi.
          </p>
          </section>


          <section className="p-4">
          <h2 className="h4">Responsabilité</h2>
          <p>
          Les éditeurs s’efforcent de fournir des informations aussi précises que possible. Toutefois, ils ne sauraient être tenus responsables des omissions, inexactitudes ou défauts de mise à jour.
          </p>
          </section>


          <section className="p-4">
          <h2 className="h4">Données personnelles et RGPD</h2>
          <p>
          Le site respecte le Règlement Général sur la Protection des Données (RGPD – UE 2016/679).
          </p>


          <h3 className="h6 mt-3">Collecte des données</h3>
          <ul>
          <li>Données fournies lors de la création d’un compte utilisateur (identifiant, adresse e-mail)</li>
          <li>Données de navigation collectées à des fins statistiques</li>
          </ul>


          <h3 className="h6 mt-3">Suivi des visites</h3>
          <p>
          Le suivi d’audience est réalisé de manière <strong>anonyme</strong> et ne permet aucune identification personnelle des visiteurs.
          </p>


          <h3 className="h6 mt-3">Finalité du traitement</h3>
          <ul>
          <li>Gestion des comptes utilisateurs et l'affichage public des structures culturelles</li>
          <li>Amélioration des performances et du contenu du site</li>
          </ul>


          <h3 className="h6 mt-3">Durée de conservation</h3>
          <p>
          Les données sont conservées uniquement pour la durée nécessaire aux finalités pour lesquelles elles sont collectées.
          </p>


          <h3 className="h6 mt-3">Droits des utilisateurs</h3>
          <p>
          Vous disposez des droits d’accès, de rectification, d’effacement, de limitation et d’opposition concernant vos données personnelles.
          </p>
          </section>


          <section className="p-4">
          <h2 className="h4">Attribution de juridiction</h2>
          <p>
          Tout litige en relation avec l’utilisation du présent site est soumis au droit français. En dehors des cas où la loi ne le permet pas, les tribunaux compétents seront seuls compétents.
          </p>
          </section>
        </div>
        </div>
        </main>
    </>
  );
}
