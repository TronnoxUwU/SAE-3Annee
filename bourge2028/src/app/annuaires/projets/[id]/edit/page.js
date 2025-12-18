"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Topbar from "@/components/Topbar.jsx";
import Style from "./page.module.css";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nomRealisation: "",
    description: "",
    adresse: "",
    latitude: "",
    longitude: "",
    departementIds: [],
  });

  /* =======================
     Chargement du projet
     ======================= */
  useEffect(() => {
    const fetchProjet = async () => {
      try {
        const res = await fetch(`/api/realisations/${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du projet");

        const data = await res.json();

        setFormData({
          nomRealisation: data.nom || "",
          description: data.description || "",
          adresse: data.projet?.adresse || "",
          latitude: data.projet?.latitude || "",
          longitude: data.projet?.longitude || "",
          departementIds: data.projet?.departement || [],
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProjet();
  }, [id]);

  /* =======================
     Handlers
     ======================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!formData.nomRealisation.trim()) {
        throw new Error("Nom du projet requis");
      }

      const payload = {
        nom: formData.nomRealisation,
        description: formData.description || null,
        type: "projet",
        projet: {
          nomProjet: formData.nomRealisation,
          adresse: formData.adresse || null,
          latitude: formData.latitude
            ? parseFloat(formData.latitude)
            : null,
          longitude: formData.longitude
            ? parseFloat(formData.longitude)
            : null,
          departement: formData.departementIds || [],
        },
      };

      //console.log(payload)

      const res = await fetch(`/api/realisations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      router.push(`/annuaires/projets/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     UI
     ======================= */
  return (
    <>
      <Topbar />

      <div className={Style.userPage}>
        <div className="container">
          <h1 className="h2 mb-4">Modifier le projet</h1>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger mb-4">{error}</div>
                )}

                {/* Nom */}
                <div className="mb-3">
                  <label className="form-label">Nom du projet *</label>
                  <input
                    type="text"
                    name="nomRealisation"
                    value={formData.nomRealisation}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                  />
                </div>

                {/* Adresse */}
                <div className="mb-3">
                  <label className="form-label">Adresse</label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* Coordonnées */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => router.back()}
                    disabled={saving}
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
