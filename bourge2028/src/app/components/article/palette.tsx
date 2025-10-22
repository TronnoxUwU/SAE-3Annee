// components/ComponentPalette.tsx
"use client";
import { FC } from "react";

const components = [
  { type: "heading", label: "Titre" },
  { type: "paragraph", label: "Paragraphe" },
  { type: "image", label: "Image" },
  { type: "carousel", label: "Carrousel" },
];

export const ComponentPalette: FC = () => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 border-l space-y-2">
      <h3 className="font-bold mb-2">Composants</h3>
      {components.map((c) => (
        <div
          key={c.type}
          className="p-2 bg-white border rounded cursor-grab"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("component", c.type)}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
};
