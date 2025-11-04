"use client";

import React, { useState } from "react";
import { Palette } from "./palette";
import { Titre } from "./blocks/titre";
import { Paragraphe } from "./blocks/paragraphe";
import { Image } from "./blocks/image";
import { Sidebar } from "./sideEdition";


interface Block {
  id: string;
  type: string;
  content?: any;
  options?: {
    headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };
}

export const Editor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const addBlockAt = (type: string, index: number) => {
    const defaultContent =
      type === "heading" ? "" :
      type === "paragraph" ? "" :
      type === "image" ? "" :
      "";

    const newBlock = { 
      id: Date.now().toString(), 
      type, 
      content: defaultContent,
      options: type === "heading" ? { headingLevel: 'h1' as 'h1'} : {} 
    };
    setBlocks((prev) => {
      const updated = [...prev];
      updated.splice(index, 0, newBlock);
      return updated;
    });
  };

  const moveBlock = (fromId: string, toIndex: number) => {
    setBlocks((prev) => {
      const fromIndex = prev.findIndex((b) => b.id === fromId);
      if (fromIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      updated.splice(adjustedIndex, 0, moved);
      return updated;
    });
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setDragOverIndex(null);
    setIsDragging(false);
    setDraggedBlockId(null);
  };

  const moveBlockUp = (id: string) => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index > 0) {
        const updated = [...prev];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        return updated;
      }
      return prev;
    });
  };

  const moveBlockDown = (id: string) => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index !== -1 && index < prev.length - 1) {
        const updated = [...prev];
        [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
        return updated;
      }
      return prev;
    });
  };

  const handleBlockDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("blockId", blockId);
    setDraggedBlockId(blockId);
    setIsDragging(true);
  };

  const handleBlockDragEnd = () => {
    setDraggedBlockId(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  const handleDropZoneDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDropZoneDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("component");
    const blockId = e.dataTransfer.getData("blockId");
    if (type) addBlockAt(type, index);
    else if (blockId) moveBlock(blockId, index);
    setDraggedBlockId(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  return (
    <div className="page-container">
      <Palette
        onAddBlock={(type) => addBlockAt(type, blocks.length)}
        onRemoveBlock={removeBlock}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
      <div className="editor">
        {isDragging && blocks.length > 0 && (
          <div
            className={`drop-zone ${dragOverIndex === 0 ? "active" : ""}`}
            onDragOver={(e) => handleDropZoneDragOver(e, 0)}
            onDrop={(e) => handleDropZoneDrop(e, 0)}
          />
        )}

        {blocks.map((block, index) => (
          <React.Fragment key={block.id}>
            <div
              className={`editor-block ${
                draggedBlockId === block.id ? "dragging" : ""
              } ${selectedBlock === block.id ? "selected" : ""}`}
              draggable
              onDragStart={(e) => handleBlockDragStart(e, block.id)}
              onDragEnd={handleBlockDragEnd}
              onClick={() => setSelectedBlock(block.id)}
            >
              <div className="block-controls">
                <button onClick={() => removeBlock(block.id)}>🗑️</button>
                <button onClick={() => moveBlockUp(block.id)} disabled={index === 0}>
                  ⬆️
                </button>
                <button
                  onClick={() => moveBlockDown(block.id)}
                  disabled={index === blocks.length - 1}
                >
                  ⬇️
                </button>
              </div>

              <div style={{ marginTop: "20px" }}>
                {block.type === "heading" && (
                  <Titre
                    value={block.content}
                    level={block.options?.headingLevel || 'h1'} 
                    onChange={(v) =>
                      setBlocks((prev) =>
                        prev.map((b) => (b.id === block.id ? { ...b, content: v } : b))
                      )
                    }
                  />
                )}

                {block.type === "paragraph" && (
                  <Paragraphe
                    value={block.content}
                    onChange={(v) =>
                      setBlocks((prev) =>
                        prev.map((b) => (b.id === block.id ? { ...b, content: v } : b))
                      )
                    }
                  />
                )}

                {block.type === "image" && (
                  <Image
                    src={block.content}
                    onChange={(v) =>
                      setBlocks((prev) =>
                        prev.map((b) => (b.id === block.id ? { ...b, content: v } : b))
                      )
                    }
                  />
                )}
              </div>
            </div>

            {isDragging  && (
              <div
                className={`drop-zone ${
                  dragOverIndex === index + 1 ? "active" : ""
                }`}
                onDragOver={(e) => handleDropZoneDragOver(e, index + 1)}
                onDrop={(e) => handleDropZoneDrop(e, index + 1)}
              />
            )}
          </React.Fragment>
        ))}

        {blocks.length === 0 && (
          <div
            className={`empty-editor ${isDragging ? "active" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIndex(0);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const type = e.dataTransfer.getData("component");
              const blockId = e.dataTransfer.getData("blockId");
              if (type) addBlockAt(type, 0);
              else if (blockId) moveBlock(blockId, 0);
              setDraggedBlockId(null);
              setDragOverIndex(null);
              setIsDragging(false);
            }}
          >
            Glissez des composants ici ou cliquez sur la palette pour commencer
          </div>
        )}
      </div>
      <Sidebar
        selectedBlock={blocks.find(b => b.id === selectedBlock) || null}
        onUpdateBlock={(id, content, options) => {
          setBlocks(prev => prev.map(b => 
            b.id === id ? { 
              ...b, 
              content,
              ...(options && { options: { ...b.options, ...options } })
            } : b
          ));
        }}
      />
    </div>
  );
};
