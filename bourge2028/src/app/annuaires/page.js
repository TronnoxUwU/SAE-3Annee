"use client";

import Topbar from "@/components/Topbar.jsx";
import Link from "next/link";

export default function LegalPage() {
  return (
    <>
      <Topbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-5">
            <h1 className="display-4 fw-bold">Annuaires</h1>
            <p className="lead text-muted">Choisissez le type d'annuaire à consulter</p>
          </div>

          <div className="col-md-4 mb-4">
            <Link href="/annuaires/projets" className="text-decoration-none">
              <div className="card h-100 shadow-sm hover-card">
                <div className="card-body text-center d-flex flex-column justify-content-center p-5">
                  <div className="mb-3">
                    <i className="bi bi-folder-fill text-primary" style={{ fontSize: "3rem" }}></i>
                  </div>
                  <h3 className="card-title fw-bold">Projets</h3>
                  <p className="card-text text-muted">
                    Consultez l'annuaire des projets en cours et à venir
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4 mb-4">
            <Link href="/annuaires/cartes" className="text-decoration-none">
              <div className="card h-100 shadow-sm hover-card">
                <div className="card-body text-center d-flex flex-column justify-content-center p-5">
                  <div className="mb-3">
                    <i className="bi bi-map-fill text-success" style={{ fontSize: "3rem" }}></i>
                  </div>
                  <h3 className="card-title fw-bold">Cartes</h3>
                  <p className="card-text text-muted">
                    Explorez l'annuaire des cartes géographiques
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4 mb-4">
            <Link href="/annuaires/techniques" className="text-decoration-none">
              <div className="card h-100 shadow-sm hover-card">
                <div className="card-body text-center d-flex flex-column justify-content-center p-5">
                  <div className="mb-3">
                    <i className="bi bi-gear-fill text-warning" style={{ fontSize: "3rem" }}></i>
                  </div>
                  <h3 className="card-title fw-bold">Techniques</h3>
                  <p className="card-text text-muted">
                    Accédez aux ressources et documentations techniques
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .hover-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </>
  );
}