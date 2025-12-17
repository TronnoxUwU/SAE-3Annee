"use client";
import React, { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

export default function StructureForm() {
    const [formData, setFormData] = useState({
        nomStructure: '',
        description: '',
        adresse: '',
        longitude: '',
        latitude: '',
        lienPhoto: '',
        departements: [],
        categories: []
    });

    const [departementsDisponibles, setDepartementsDisponibles] = useState([]);
    const [categoriesDisponibles, setCategoriesDisponibles] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        axios.get("/api/categories")
            .then(res => setCategoriesDisponibles(res.data))
            .catch(err => console.error("Erreur chargement catégories :", err));

        axios.get("/api/departements")
            .then(res => setDepartementsDisponibles(res.data))
            .catch(err => console.error("Erreur chargement départements :", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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


    const toggleCategory = (cat) => {
        setFormData(prev => {
            const exists = prev.categories.find(c => c.id === cat.id);
            if (exists) {
                return {
                    ...prev,
                    categories: prev.categories.filter(c => c.id !== cat.id)
                };
            } else {
                return {
                    ...prev,
                    categories: [...prev.categories, { id: cat.id, nom: cat.nom }]
                };
            }
        });
    };

    const renderCategory = (cat, level = 0) => {
        const isChecked = formData.categories.some(c => c.id === cat.id);
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

    const handleSubmit = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            if (!formData.nomStructure.trim()) throw new Error('Le nom de la structure est requis');
            const dataToSend = {
                nomStructure: formData.nomStructure,
                description: formData.description || null,
                adresse: formData.adresse || null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                lienPhoto: formData.lienPhoto || null,
                dateCreation: new Date().toISOString(),
                waiting: true,
                // departements: {id, nomDep} pour correspondre au console.log du back
                departements: (formData.departements || []).map(d => ({
                    id: d.id || d,
                    nomDep: d.nomDep || 'Inconnu'
                })),
                // cats: juste renvoyer ce qui est dans formData.categories
                cats: formData.categories || [],
            };

            const response = await fetch('/api/structures', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la création');
            }

            setMessage({ type: 'success', text: 'Structure créée avec succès !' });
            setFormData({
                nomStructure: '',
                description: '',
                adresse: '',
                longitude: '',
                latitude: '',
                lienPhoto: '',
                departements: [],
                categories: []
            });

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <Topbar />
            <div className="container mt-4">
                <div className="card">
                    <div className="card-body">
                        <h1 className="card-title mb-3">Nouvelle Structure</h1>
                        <p>Remplissez les informations de la structure</p>

                        {message.text && (
                            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                                {message.text}
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-card-text me-2"></i>Nom de la structure *</label>
                            <input type="text" name="nomStructure" value={formData.nomStructure} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-pencil-square me-2"></i>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="form-control"></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-geo-alt me-2"></i>Adresse</label>
                            <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-image me-2"></i>Lien de l'image</label>
                            <input type="url" name="lienPhoto" value={formData.lienPhoto} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-map me-2"></i>Coordonnées GPS</label>
                            <div className="row">
                                <div className="col">
                                    <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} className="form-control" placeholder="Latitude" />
                                </div>
                                <div className="col">
                                    <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} className="form-control" placeholder="Longitude" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-bank me-2"></i>Départements</label>
                            <div className="row">
                                {departementsDisponibles.map(dept => (
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

                        <div className="mb-3">
                            <label className="form-label">Catégories</label>
                            {categoriesDisponibles.map(cat => renderCategory(cat))}
                        </div>

                        <button onClick={handleSubmit} disabled={loading} className="btn btn-primary w-100">
                            {loading ? 'Création en cours...' : 'Créer la structure'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}