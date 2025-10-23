"use client";

import React from "react";

interface PaletteProps {
  onAddBlock: (type: string) => void;
  onRemoveBlock: (id: string) => void;
}

const components = [
  { type: "heading", label: "Titre" },
  { type: "paragraph", label: "Paragraphe" },
  { type: "image", label: "Image" },
];

export const Palette: React.FC<PaletteProps> = ({ onAddBlock, onRemoveBlock }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData("component", type);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const blockId = e.dataTransfer.getData("blockId"); // 👈 bloc existant
    if (blockId) {
      onRemoveBlock(blockId);
      return;
    }

    // Optionnel : si tu veux permettre de drop directement depuis palette, sinon tu peux supprimer cette partie
    const type = e.dataTransfer.getData("component");
    if (type) {
      onAddBlock(type);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className="palette"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h3>Composants</h3>
      {components.map((c) => (
        <div
          key={c.type}
          draggable
          onDragStart={(e) => handleDragStart(e, c.type)}
          onClick={() => onAddBlock(c.type)}
          className="palette-item"
        >
          {c.label}
        </div>
      ))}

      <div className="palette-trash-zone">
      </div>
    </div>
  );
};
