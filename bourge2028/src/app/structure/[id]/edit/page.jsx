"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Topbar from "@/components/Topbar.jsx";
import Style from "../page.module.css";
import axios from "axios";

export default function StructureEditPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    nomStructure: '',
    description: '',
    adresse: '',
    longitude: '',
    latitude: '',
    lienPhoto: '',
    departements: [],
    categories: [],
    personnes: []
  });
  const [allDepartements, setAllDepartements] = useState([]);
  const [selectedDepartements, setSelectedDepartements] = useState([]);
  const [categoriesDisponibles, setCategoriesDisponibles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);


  const toggleDep = (dept) => {
    setFormData(prev => {
      const exists = prev.departements.find(d => d.id === dept.id);
      if (exists) {
        return {
          ...prev,
          departements: prev.departements.filter(d => d.id !== dept.id)
        };
      } else {
        return {
          ...prev,
          departements: [...prev.departements, { id: dept.id, nomDep: dept.nomDep }]
        };
      }
    });
  };
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
          nomStructure: structureData.nomStructure,
          description: structureData.description || null,
          adresse: structureData.adresse || null,
          longitude: structureData.longitude ? parseFloat(structureData.longitude) : undefined,
          latitude: structureData.latitude ? parseFloat(structureData.latitude) : undefined,
          lienPhoto: structureData.lienPhoto || null,
          dateCreation: structureData.dateCreation || new Date().toISOString(),
          waiting: structureData.waiting || true,
          // departements: {id, nomDep} pour correspondre au console.log du back
          departements: (structureData.departements || []).map(d => ({
            id: d.id || d,
            nomDep: d.nomDep || 'Inconnu'
          })),
          // cats: juste renvoyer ce qui est dans formData.categories
          cats: structureData.cats || [],
          personnes: structureData.personnes || [],
          realisations: structureData.realisations || []
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
        const catRes = await fetch("/api/categories");
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategoriesDisponibles(catData);
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

  const toggleCategory = (cat) => {
    setFormData(prev => {
      const exists = prev.cats.find(c => c.id === cat.id);
      if (exists) {
        return {
          ...prev,
          cats: prev.cats.filter(c => c.id !== cat.id)
        };
      } else {
        return {
          ...prev,
          cats: [...prev.cats, { id: cat.id, nom: cat.nom }]
        };
      }
    });
  };

  const renderCategory = (cat, level = 0) => {
    const isChecked = formData.cats.some(c => c.id === cat.id);
    return (
      <div key={cat.id} className="form-check" style={{ marginLeft: 20 }}>
        <input
          className="form-check-input"
          type="checkbox"
          checked={isChecked}
          onChange={() => toggleCategory(cat)}
          id={`category-${cat.id}`}
        />
        <label className="form-check-label" htmlFor={`category-${cat.id}`}>{cat.nom}</label>

        {cat.children?.length > 0 && (
          <div>
            {cat.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
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
                        {allDepartements.map(dept => (
                          <div className="col-6" key={dept.id}>
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={formData.departements.some(d => d.id === dept.id)}
                                onChange={() => toggleDep(dept)}
                                id={`dept-${dept.id}`}
                              />
                              <label className="form-check-label" htmlFor={`dept-${dept.id}`}>{dept.nomDep}</label>
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

                {/* Categories */}
                <div className="mb-3">
                  <label className="form-label"><i className="bi bi-funnel"></i>Catégories</label>
                  {categoriesDisponibles.map(cat => renderCategory(cat))}
                </div>

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