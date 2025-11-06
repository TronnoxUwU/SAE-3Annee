"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Topbar from "@/components/Topbar.jsx";
import Style from "../page.module.css";

export default function StructureEditPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [formData, setFormData] = useState({
    nomStructure: "",
    description: "",
    departements: []
  });
  const [allDepartements, setAllDepartements] = useState([]);
  const [selectedDepartements, setSelectedDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Vérification des permissions
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger la structure
        const structureRes = await fetch(`/api/structures/${params.id}`);
        if (!structureRes.ok) {
          throw new Error("Structure non trouvée");
        }
        const structureData = await structureRes.json();
        
        // Vérifier les permissions
        if (session?.user?.role !== "Admin" && session?.user?.structure !== structureData.id) {
          router.push(`/structure/${params.id}`);
          return;
        }
        
        setFormData({
          nomStructure: structureData.nomStructure || "",
          description: structureData.description || "",
          departements: structureData.departements || []
        });
        
        setSelectedDepartements(
          structureData.departements?.map(d => d.departementId) || []
        );
        
        // Charger tous les départements disponibles
        const depRes = await fetch("/api/departements");
        if (depRes.ok) {
          const depData = await depRes.json();
          setAllDepartements(depData);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id && session) {
      fetchData();
    }
  }, [params.id, session, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDepartementToggle = (departementId) => {
    setSelectedDepartements(prev => {
      if (prev.includes(departementId)) {
        return prev.filter(id => id !== departementId);
      } else {
        return [...prev, departementId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nomStructure.trim()) {
      setError("Le nom de la structure est requis");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/structures/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          departementIds: selectedDepartements
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour");
      }

      // Redirection vers la page de détail
      router.push(`/structure/${params.id}`);
      
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/structure/${params.id}`);
  };

  if (loading) {
    return (
      <>
        <Topbar />
        <div className={Style.userPage}>
          <p>Chargement...</p>
        </div>
      </>
    );
  }

  if (error && !formData.nomStructure) {
    return (
      <>
        <Topbar />
        <div className={Style.userPage}>
          <h1>Erreur</h1>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => router.push("/structure")}
          >
            Retour aux structures
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className={Style.userPage}>
        <div className={Style.header}>
          <h1>Modifier la structure</h1>
        </div>

        <form onSubmit={handleSubmit} className={Style.editForm}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Nom de la structure */}
          <div className={Style.formGroup}>
            <label htmlFor="nomStructure" className={Style.formLabel}>
              Nom de la structure <span className={Style.required}>*</span>
            </label>
            <input
              type="text"
              id="nomStructure"
              name="nomStructure"
              className="form-control"
              value={formData.nomStructure}
              onChange={handleInputChange}
              required
              placeholder="Entrez le nom de la structure"
            />
          </div>

          {/* Description */}
          <div className={Style.formGroup}>
            <label htmlFor="description" className={Style.formLabel}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              placeholder="Décrivez la structure..."
            />
          </div>

          {/* Départements */}
          {allDepartements.length > 0 && (
            <div className={Style.formGroup}>
              <label className={Style.formLabel}>
                Départements
              </label>
              <div className={Style.departementsList}>
                {allDepartements.map(dep => (
                  <div key={dep.id} className={Style.checkboxItem}>
                    <input
                      type="checkbox"
                      id={`dep-${dep.id}`}
                      checked={selectedDepartements.includes(dep.id)}
                      onChange={() => handleDepartementToggle(dep.id)}
                      className="form-check-input"
                    />
                    <label htmlFor={`dep-${dep.id}`} className="form-check-label">
                      {dep.nom}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className={Style.formActions}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}