"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar.jsx";
import Style from "./page.module.css";

export default function CreatePage() {
  const router = useRouter();
  const [type, setType] = useState("projet");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nomRealisation: "",
    description: "",
    structureId: "",
    departementIds: [],
    adresse: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!formData.nomRealisation.trim()) {
        throw new Error("Nom de la réalisation requis");
      }

      // Payload de base
      const payload = {
        nom: formData.nomRealisation,
        dateCreation: new Date(),
        description: formData.description || null,
        structureId: formData.structureId || null,
        type,
      };

      // Construction selon le type
      if (type === "projet") {
        payload.projet = {
          nomProjet: formData.nomRealisation,
          adresse: formData.adresse || null,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          departement: formData.departementIds || [],
        };
      } else if (type === "materiau") {
        payload.materiaux = {
          nomMateriau: formData.nomRealisation,
        };
      } else if (type === "technique") {
        payload.technique = {
          nomTechnique: formData.nomRealisation,
        };
      }

      console.log("📤 Payload envoyé:", payload);

      const res = await fetch("/api/realisations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la création");
      }

      const result = await res.json();
      console.log("✅ Résultat:", result);

      // Redirection selon type
      if (type === "projet") {
        router.push(`/annuaires/projets/${result.projet?.id}`);
      } else if (type === "materiau") {
        router.push(`/materiaux/${result.materiaux?.id}`);
      } else if (type === "technique") {
        router.push(`/techniques/${result.technique?.id}`);
      }

    } catch (err) {
      setError(err.message);
      console.error("❌ Erreur:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Topbar />
      <div className={Style.userPage}>
        <div className="container">
          <h1 className="h2 mb-4">Créer une ressource</h1>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>

                {/* Type */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Type</label>
                  <select
                    className="form-select"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="projet">Projet</option>
                    <option value="materiau">Matériau</option>
                    <option value="technique">Technique</option>
                  </select>
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                {/* Nom de la réalisation */}
                <div className="mb-3">
                  <label className="form-label">Nom de la réalisation *</label>
                  <input
                    type="text"
                    name="nomRealisation"
                    placeholder="Nom de la réalisation"
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
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                  />
                </div>

                {/* Formulaire Projet */}
                {type === "projet" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Adresse</label>
                      <input
                        type="text"
                        name="adresse"
                        placeholder="Adresse du projet"
                        value={formData.adresse}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Latitude</label>
                        <input
                          type="number"
                          step="any"
                          name="latitude"
                          placeholder="Ex: 48.8566"
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
                          placeholder="Ex: 2.3522"
                          value={formData.longitude}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </>
                )}

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
                    {saving ? "Création..." : "Créer"}
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