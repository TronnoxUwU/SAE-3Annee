"use client";

import React, { FC, useState } from "react";

interface Block {
  id: string;
  type: string;
  content?: string;
}

export const Editor: FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("component");

    setBlocks((prev) => [
      ...prev,
      { id: Date.now().toString(), type, content: "" },
    ]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className="editor"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {blocks.map((block) => (
        <div key={block.id} className="editor-block">
          {block.type === "heading" && <h2>Votre titre ici</h2>}
          {block.type === "paragraph" && <p>Votre paragraphe ici…</p>}
          {block.type === "image" && <img src="https://via.placeholder.com/300" alt="placeholder" />}
        </div>
      ))}
    </div>
  );
};
