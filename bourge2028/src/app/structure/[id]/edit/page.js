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
          <div className="d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="text-muted">Chargement des données...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error && !formData.nomStructure) {
    return (
      <>
        <Topbar />
        <div className={Style.userPage}>
          <div className="container mt-5">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
              <div>
                <h4 className="alert-heading mb-2">Erreur</h4>
                <p className="mb-0">{error}</p>
              </div>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => router.push("/structure")}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Retour aux structures
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className={Style.userPage}>
        <div className="container" >
          {/* En-tête avec bouton retour */}
          <div className="d-flex align-items-center mb-4">
            {/* <button 
              type="button"
              className="btn btn-outline-secondary me-3"
              onClick={handleCancel}
              disabled={saving}
            >
              <i className="bi bi-arrow-left"></i>
            </button> */}
            <div className={Style.h1div}>
              <h1 className="h2 mb-1">Modifier la structure</h1>
              <p className="text-muted mb-0">Mettez à jour les informations de la structure</p>
            </div>
          </div>

          {/* Carte du formulaire */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger d-flex align-items-start mb-4" role="alert">
                    <i className="bi bi-exclamation-circle-fill me-2 mt-1"></i>
                    <div>{error}</div>
                  </div>
                )}

                {/* Nom de la structure */}
                <div className="mb-4">
                  <label htmlFor="nomStructure" className="form-label fw-semibold">
                    Nom de la structure <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="nomStructure"
                    name="nomStructure"
                    className="form-control form-control-lg"
                    value={formData.nomStructure}
                    onChange={handleInputChange}
                    required
                    placeholder="Entrez le nom de la structure"
                    disabled={saving}
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-semibold">
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
                    disabled={saving}
                    style={{ resize: 'vertical' }}
                  />
                  <div className="form-text">
                    <i className="bi bi-info-circle me-1"></i>
                    Ajoutez une description pour faciliter l'identification de la structure
                  </div>
                </div>

                {/* Départements */}
                {allDepartements.length > 0 && (
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-3">
                      Départements associés
                    </label>
                    <div className="p-3 bg-light rounded">
                      <div className="row g-3">
                        {allDepartements.map(dep => (
                          <div key={dep.id} className="col-md-6">
                            <div className="form-check p-3 bg-white rounded border" 
                                 style={{ 
                                   cursor: 'pointer',
                                   transition: 'all 0.2s ease',
                                   borderColor: selectedDepartements.includes(dep.id) ? '#0d6efd' : '#dee2e6'
                                 }}
                                 onMouseEnter={(e) => {
                                   if (!selectedDepartements.includes(dep.id)) {
                                     e.currentTarget.style.borderColor = '#adb5bd';
                                   }
                                 }}
                                 onMouseLeave={(e) => {
                                   if (!selectedDepartements.includes(dep.id)) {
                                     e.currentTarget.style.borderColor = '#dee2e6';
                                   }
                                 }}>
                              <input
                                type="checkbox"
                                id={`dep-${dep.id}`}
                                checked={selectedDepartements.includes(dep.id)}
                                onChange={() => handleDepartementToggle(dep.id)}
                                className="form-check-input"
                                disabled={saving}
                                style={{ cursor: 'pointer' }}
                              />
                              <label 
                                htmlFor={`dep-${dep.id}`} 
                                className="form-check-label ms-2 w-100"
                                style={{ cursor: 'pointer' }}
                              >
                                {dep.nom}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="form-text mt-2">
                      <i className="bi bi-check-circle me-1"></i>
                      {selectedDepartements.length} département{selectedDepartements.length > 1 ? 's' : ''} sélectionné{selectedDepartements.length > 1 ? 's' : ''}
                    </div>
                  </div>
                )}

                <hr className="my-4" />

                {/* Boutons d'action */}
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
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
                        Enregistrer les modifications
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-3 text-center">
            <small className="text-muted">
              <i className="bi bi-shield-check me-1"></i>
              Les modifications seront enregistrées de manière sécurisée
            </small>
          </div>
        </div>
      </div>

    </>
  );
}