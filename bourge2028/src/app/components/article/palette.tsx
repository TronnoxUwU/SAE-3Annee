"use client";

import React, { FC } from "react";

const components = [
  { type: "heading", label: "Titre" },
  { type: "paragraph", label: "Paragraphe" },
  { type: "image", label: "Image" },
];

export const Palette: FC = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData("component", type);
  };

  return (
    <div className="palette">
      <h3>Composants</h3>
      {components.map((c) => (
        <div
          key={c.type}
          className="palette-item"
          draggable
          onDragStart={(e) => handleDragStart(e, c.type)}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
};
