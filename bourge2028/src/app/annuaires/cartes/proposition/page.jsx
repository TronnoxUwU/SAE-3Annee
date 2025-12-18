"use client";
import React, { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { useRouter } from "next/navigation";

export default function StructureForm() {
    const router = useRouter();


    const [formData, setFormData] = useState({
        titre: '',
        descriptionCarte: '',
        lienCarte: '',
        categories: [],
    });

    const [categoriesDisponibles, setCategoriesDisponibles] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        axios.get("/api/categories")
            .then(res => setCategoriesDisponibles(res.data))
            .catch(err => console.error("Erreur chargement catégories :", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            if (!formData.titre.trim()) throw new Error('Le nom de la structure est requis');
            const dataToSend = {
                titre: formData.titre,
                descriptionCarte: formData.descriptionCarte || null,
                lienCarte: formData.lienCarte || null,
                waiting: true,
                // cats: juste renvoyer ce qui est dans formData.categories
                categories: formData.categories || [],
            };

            const response = await fetch('/api/cartes', {
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
                titre: '',
                descriptionCarte: '',
                lienCarte: '',
                categories: []
            });
            router.push(`/annuaires/cartes`);
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
                        <h1 className="card-title mb-3">Nouvelle Carte</h1>
                        <p>Remplissez les informations sur la carte</p>

                        {message.text && (
                            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                                {message.text}
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-card-text me-2"></i>Nom de la carte *</label>
                            <input type="text" name="titre" value={formData.titre} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-pencil-square me-2"></i>descriptionCarte</label>
                            <textarea name="descriptionCarte" value={formData.descriptionCarte} onChange={handleChange} rows={4} className="form-control"></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-image me-2"></i>Lien de la carte</label>
                            <input type="url" name="lienCarte" value={formData.lienCarte} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-funnel"></i>Catégories</label>
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