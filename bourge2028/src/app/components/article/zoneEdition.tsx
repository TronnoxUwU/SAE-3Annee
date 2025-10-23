"use client";

import React, { useState } from "react";
import { HeadingBlock } from "./blocks/titre";
import { ParagraphBlock } from "./blocks/paragraphe";
import { ImageBlock } from "./blocks/image";
import { Palette } from "./palette";

interface Block {
  id: string;
  type: string;
  content?: string;
}

export const Editor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addBlockAt = (type: string, index: number) => {
    const newBlock = { id: Date.now().toString(), type };
    setBlocks(prev => {
      const updated = [...prev];
      updated.splice(index, 0, newBlock);
      return updated;
    });
  };

  const moveBlock = (id: string, index: number) => {
    setBlocks(prev => {
      const currentIndex = prev.findIndex(b => b.id === id);
      if (currentIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(index, 0, moved);
      return updated;
    });
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const handleDropAt = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("component");
    const blockId = e.dataTransfer.getData("blockId");

    if (type) {
      addBlockAt(type, index);
    } else if (blockId) {
      moveBlock(blockId, index);
    }

    setDraggedBlockId(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // 🔼 Déplacer un bloc vers le haut
  const moveBlockUp = (id: string) => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index > 0) {
        const updated = [...prev];
        const temp = updated[index - 1];
        updated[index - 1] = updated[index];
        updated[index] = temp;
        return updated;
      }
      return prev;
    });
  };

  // 🔽 Déplacer un bloc vers le bas
  const moveBlockDown = (id: string) => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index !== -1 && index < prev.length - 1) {
        const updated = [...prev];
        const temp = updated[index + 1];
        updated[index + 1] = updated[index];
        updated[index] = temp;
        return updated;
      }
      return prev;
    });
  };

  return (
    <div className="editor-container">
      <Palette
        onAddBlock={(type) => addBlockAt(type, blocks.length)}
        onRemoveBlock={removeBlock}
      />

      <div className="editor" onDragOver={handleDragOver}>
        {blocks.map((block, index) => (
          <React.Fragment key={block.id}>
            {isDragging && (
              <div
                className="drop-zone"
                onDrop={(e) => handleDropAt(e, index)}
                onDragOver={handleDragOver}
              ></div>
            )}

            <div
              className={`editor-block ${
                draggedBlockId === block.id ? "dragging" : ""
              }`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("blockId", block.id);
                setDraggedBlockId(block.id);
                setIsDragging(true);
              }}
              onDragEnd={() => {
                setDraggedBlockId(null);
                setIsDragging(false);
              }}
            >
              <div className="block-controls">
                <button
                  className="move-button"
                  onClick={() => removeBlock(block.id)}
                >
                  🗑️
                </button>
                <div>
                  <button
                    className="move-button up"
                    onClick={() => moveBlockUp(block.id)}
                    title="Monter"
                  >
                    ⬆️
                  </button>
                  <button
                    className="move-button down"
                    onClick={() => moveBlockDown(block.id)}
                    title="Descendre"
                  >
                    ⬇️
                  </button>
                </div>
              </div>

              {block.type === "heading" && <HeadingBlock />}
              {block.type === "paragraph" && <ParagraphBlock />}
              {block.type === "image" && <ImageBlock />}
            </div>
          </React.Fragment>
        ))}

        {isDragging && (
          <div
            className="drop-zone"
            onDrop={(e) => handleDropAt(e, blocks.length)}
            onDragOver={handleDragOver}
          ></div>
        )}
      </div>
    </div>
  );
};
