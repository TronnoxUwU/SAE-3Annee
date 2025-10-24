"use client";

import React, { useState } from "react";

// Composants de blocs simplifiés
const HeadingBlock = () => <h2>Votre titre ici</h2>;
const ParagraphBlock = () => <p>Votre paragraphe ici</p>;
const ImageBlock = () => <div style={{padding: '20px', background: '#f0f0f0', textAlign: 'center'}}>📷 Image</div>;

// Palette
const Palette = ({ onAddBlock, onRemoveBlock, isDragging, setIsDragging }) => {
  const components = [
    { type: "heading", label: "Titre" },
    { type: "paragraph", label: "Paragraphe" },
    { type: "image", label: "Image" },
  ];

  const handleDragStart = (e, type) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("component", type);
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData("blockId");
    if (blockId) {
      onRemoveBlock(blockId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div
      style={{
        width: '200px',
        padding: '20px',
        background: '#f5f5f5',
        borderRight: '1px solid #ddd',
        minHeight: '100vh'
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h3>Composants</h3>
      {components.map((c) => (
        <div
          key={c.type}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, c.type)}
          onClick={() => onAddBlock(c.type)}
          style={{
            padding: '10px',
            margin: '10px 0',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'move',
            userSelect: 'none'
          }}
        >
          {c.label}
        </div>
      ))}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        border: '2px dashed #999',
        borderRadius: '4px',
        textAlign: 'center',
        color: '#666'
      }}>
        🗑️ Glissez ici pour supprimer
      </div>
    </div>
  );
};

// Editor principal
export default function Editor() {
  const [blocks, setBlocks] = useState([]);
  const [draggedBlockId, setDraggedBlockId] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const addBlockAt = (type, index) => {
    const newBlock = { id: Date.now().toString(), type };
    setBlocks(prev => {
      const updated = [...prev];
      updated.splice(index, 0, newBlock);
      return updated;
    });
  };

  const moveBlock = (fromId, toIndex) => {
    setBlocks(prev => {
      const fromIndex = prev.findIndex(b => b.id === fromId);
      if (fromIndex === -1) return prev;
      
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      
      // Ajuster l'index si on déplace vers le bas
      const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      updated.splice(adjustedIndex, 0, moved);
      
      return updated;
    });
  };

  const removeBlock = (id) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const moveBlockUp = (id) => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index > 0) {
        const updated = [...prev];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        return updated;
      }
      return prev;
    });
  };

  const moveBlockDown = (id) => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index !== -1 && index < prev.length - 1) {
        const updated = [...prev];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        return updated;
      }
      return prev;
    });
  };

  const handleBlockDragStart = (e, blockId) => {
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

  const handleDropZoneDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDropZoneDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    const type = e.dataTransfer.getData("component");
    const blockId = e.dataTransfer.getData("blockId");

    if (type) {
      addBlockAt(type, index);
    } else if (blockId && blockId !== draggedBlockId) {
      moveBlock(blockId, index);
    } else if (blockId) {
      moveBlock(blockId, index);
    }

    setDraggedBlockId(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Palette 
        onAddBlock={(type) => addBlockAt(type, blocks.length)} 
        onRemoveBlock={removeBlock}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
      
      <div style={{ flex: 1, padding: '40px', overflow: 'auto' }}>
        {/* Drop zone avant le premier bloc */}
        {isDragging && (
          <div
            onDragOver={(e) => handleDropZoneDragOver(e, 0)}
            onDrop={(e) => handleDropZoneDrop(e, 0)}
            style={{
              height: dragOverIndex === 0 ? '40px' : '8px',
              background: dragOverIndex === 0 ? '#e3f2fd' : '#e0e0e0',
              border: dragOverIndex === 0 ? '2px dashed #2196f3' : '2px dashed #ccc',
              borderRadius: '4px',
              margin: '8px 0',
              transition: 'all 0.2s'
            }}
          />
        )}

        {blocks.map((block, index) => (
          <React.Fragment key={block.id}>
            <div
              draggable={true}
              onDragStart={(e) => handleBlockDragStart(e, block.id)}
              onDragEnd={handleBlockDragEnd}
              style={{
                opacity: draggedBlockId === block.id ? 0.5 : 1,
                padding: '20px',
                margin: '10px 0',
                background: 'white',
                border: '2px solid #ddd',
                borderRadius: '8px',
                position: 'relative',
                cursor: 'move'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'flex',
                gap: '5px'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBlock(block.id);
                  }}
                  style={{
                    padding: '5px 10px',
                    cursor: 'pointer',
                    border: 'none',
                    background: '#fff',
                    borderRadius: '4px'
                  }}
                >
                  🗑️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveBlockUp(block.id);
                  }}
                  disabled={index === 0}
                  style={{
                    padding: '5px 10px',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    border: 'none',
                    background: '#fff',
                    borderRadius: '4px',
                    opacity: index === 0 ? 0.5 : 1
                  }}
                >
                  ⬆️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveBlockDown(block.id);
                  }}
                  disabled={index === blocks.length - 1}
                  style={{
                    padding: '5px 10px',
                    cursor: index === blocks.length - 1 ? 'not-allowed' : 'pointer',
                    border: 'none',
                    background: '#fff',
                    borderRadius: '4px',
                    opacity: index === blocks.length - 1 ? 0.5 : 1
                  }}
                >
                  ⬇️
                </button>
              </div>

              <div style={{ marginTop: '20px' }}>
                {block.type === "heading" && <HeadingBlock />}
                {block.type === "paragraph" && <ParagraphBlock />}
                {block.type === "image" && <ImageBlock />}
              </div>
            </div>

            {/* Drop zone après chaque bloc */}
            {isDragging && (
              <div
                onDragOver={(e) => handleDropZoneDragOver(e, index + 1)}
                onDrop={(e) => handleDropZoneDrop(e, index + 1)}
                style={{
                  height: dragOverIndex === index + 1 ? '40px' : '8px',
                  background: dragOverIndex === index + 1 ? '#e3f2fd' : '#e0e0e0',
                  border: dragOverIndex === index + 1 ? '2px dashed #2196f3' : '2px dashed #ccc',
                  borderRadius: '4px',
                  margin: '8px 0',
                  transition: 'all 0.2s'
                }}
              />
            )}
          </React.Fragment>
        ))}

        {blocks.length === 0 && (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#999',
            fontSize: '18px',
            border: '2px dashed #ddd',
            borderRadius: '8px'
          }}>
            Glissez des composants ici ou cliquez sur la palette pour commencer
          </div>
        )}
      </div>
    </div>
  );
}