"use client";

import React, { useState,useEffect } from "react";

interface SavePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (titre: string) => void;
  initialTitle?: string;
}

export const SavePopup: React.FC<SavePopupProps> = ({ isOpen, onClose, onSave, initialTitle = "" }) => {
  const [titre, setTitre] = useState(initialTitle);

  useEffect(() => {
    if (isOpen) {
      setTitre(initialTitle);
    }
  }, [isOpen, initialTitle]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titre.trim()) {
      onSave(titre);
      setTitre("");
      onClose();
    } else {
      alert("Veuillez entrer un titre pour l'article");
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>Sauvegarder l'article</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titre">Titre de l'article :</label>
            <input
              id="titre"
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Entrez le titre de votre article..."
              autoFocus
              className="popup-input"
            />
          </div>
          <div className="popup-buttons">
            <button type="button" onClick={onClose} className="popup-btn-cancel">
              Annuler
            </button>
            <button type="submit" className="popup-btn-save">
              💾 Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};