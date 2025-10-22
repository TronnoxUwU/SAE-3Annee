// components/EditorCanvas.tsx
"use client";
import { useState } from "react";

export default function EditorCanvas() {
  const [blocks, setBlocks] = useState<any[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("component");
    const newBlock = { type, id: Date.now(), content: "" };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleChange = (id: number, value: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content: value } : b))
    );
  };

  return (
    <div
      className="w-3/4 p-4 min-h-screen bg-gray-50"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {blocks.map((block) => {
        if (block.type === "heading") {
          return (
            <div key={block.id} className="mb-4">
              <select
                onChange={(e) => handleChange(block.id, e.target.value)}
                value={block.content || "h1"}
                className="border p-1 mr-2"
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
              </select>
              <input
                type="text"
                placeholder="Titre..."
                className="border p-1 w-1/2"
              />
            </div>
          );
        }
        if (block.type === "paragraph") {
          return (
            <textarea
              key={block.id}
              placeholder="Paragraphe..."
              className="border p-2 w-full mb-4"
              onChange={(e) => handleChange(block.id, e.target.value)}
            />
          );
        }
        if (block.type === "image") {
          return (
            <div key={block.id} className="border p-2 mb-4">
              <input type="text" placeholder="URL de l'image" className="w-full border p-1" />
            </div>
          );
        }
        if (block.type === "carousel") {
          return (
            <div key={block.id} className="border p-2 mb-4">
              <p>Carrousel - Ajouter plusieurs URLs</p>
              <textarea className="border p-1 w-full" placeholder="URL séparées par des virgules" />
            </div>
          );
        }
      })}
    </div>
  );
}
    