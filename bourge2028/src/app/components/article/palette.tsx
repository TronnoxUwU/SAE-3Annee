"use client";

import React from "react";

interface PaletteProps {
  onAddBlock: (type: string) => void;
  onRemoveBlock: (id: string) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  onSave: () => void; // 🆕 nouvelle prop
}

export const Palette: React.FC<PaletteProps> = ({
  onAddBlock,
  onRemoveBlock,
  isDragging,
  setIsDragging,
  onSave, // 🆕
}) => {
  const components = [
    { type: "heading", label: "Titre" },
    { type: "paragraph", label: "Paragraphe" },
    { type: "image", label: "Image" },
  ];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("component", type);
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData("blockId");
    if (blockId) onRemoveBlock(blockId);
    setIsDragging(false);
  };

  const handleDragEnd = () => setIsDragging(false);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <div className="palette" onDrop={handleDrop} onDragOver={handleDragOver}>
      <button onClick={onSave} className="save-button">
        💾 Sauvegarder
      </button>

      <h3>Composants</h3>
      {components.map((c) => (
        <div
          key={c.type}
          draggable
          onDragStart={(e) => handleDragStart(e, c.type)}
          onDragEnd={handleDragEnd}
          onClick={() => onAddBlock(c.type)}
          className="palette-item"
        >
          {c.label}
        </div>
      ))}

      <div className="trash-zone">🗑️ Glissez ici pour supprimer</div>
    </div>
  );
};
