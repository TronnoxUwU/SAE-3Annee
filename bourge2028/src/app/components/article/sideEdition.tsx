import React, { useState, useRef } from "react";

export const Sidebar = ({ selectedBlock, onUpdateBlock }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormatToTextarea = (tag: string, textareaElement: HTMLTextAreaElement | null) => {
    if (!textareaElement) return;

    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;
    const text = textareaElement.value;
    const selectedText = text.substring(start, end);

    if (!selectedText) {
      alert("Veuillez sélectionner du texte à formater");
      return;
    }

    const openTag = `<${tag}>`;
    const closeTag = `</${tag}>`;
    const newText = 
      text.substring(0, start) +
      openTag + selectedText + closeTag +
      text.substring(end);

    onUpdateBlock(selectedBlock.id, newText);

    // Remettre le focus
    setTimeout(() => {
      textareaElement.focus();
      const newCursorPos = start + openTag.length + selectedText.length + closeTag.length;
      textareaElement.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const applyFormat = (tag: string) => {
    // Essayer d'abord dans le textarea de la sidebar
    if (textareaRef.current && document.activeElement === textareaRef.current) {
      applyFormatToTextarea(tag, textareaRef.current);
      return;
    }

    // Sinon chercher le textarea dans l'éditeur
    const editorTextareas = document.querySelectorAll('.paragraph-textarea');
    editorTextareas.forEach((textarea) => {
      const selection = (textarea as HTMLTextAreaElement).selectionStart;
      if (selection !== undefined && selection >= 0) {
        applyFormatToTextarea(tag, textarea as HTMLTextAreaElement);
      }
    });
  };

  if (!selectedBlock) {
    return (
      <aside className="sidebar">
        <h3>Propriétés</h3>
        <p className="no-selection">Sélectionnez un bloc pour l'éditer</p>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <h3>Propriétés du bloc</h3>
      <div className="block-info">
        <strong>Type:</strong> {selectedBlock.type === "heading" ? "Titre" : selectedBlock.type === "paragraph" ? "Paragraphe" : "Image"}
      </div>

      {selectedBlock.type === "paragraph" && (
        <div className="paragraph-option">
          <div className="paragraph-content">
            <h4>Contenu</h4>
            <textarea
              ref={textareaRef}
              value={selectedBlock.content || ""}
              onChange={(e) => onUpdateBlock(selectedBlock.id, e.target.value)}
              placeholder="Paragraphe..."
              className="heading-textarea-sidebar"
              rows={5}
            />
          </div>
          
          <div className="formatting-toolbar">
            <h4>Formatage</h4>
            <div className="toolbar-buttons">
              <button
                onClick={() => applyFormat("strong")}
                className="format-btn"
                title="Gras"
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => applyFormat("em")}
                className="format-btn"
                title="Italique"
              >
                <em>I</em>
              </button>
              <button
                onClick={() => applyFormat("u")}
                className="format-btn"
                title="Souligné"
              >
                <u>U</u>
              </button>
            </div>
            <p className="format-help">
              💡 Sélectionnez du texte puis cliquez sur un bouton de formatage
            </p>
          </div>
        </div>
      )}

      {selectedBlock.type === "image" && (
        <div className="image-options">
          <h4>URL de l'image</h4>
          <input
            type="text"
            value={selectedBlock.content || ""}
            onChange={(e) => onUpdateBlock(selectedBlock.id, e.target.value)}
            placeholder="https://..."
            className="image-url-input"
          />
        </div>
      )}

      {selectedBlock.type === "heading" && (
        <div className="heading-options">
          <div>
            <h4>Niveau de titre :</h4>
            <select
              value={selectedBlock.options?.headingLevel || 'h2'}
              onChange={(e) => {
                const newLevel = e.target.value as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                onUpdateBlock(selectedBlock.id, selectedBlock.content, { headingLevel: newLevel });
              }}
              className="heading-level-select"
            >
              <option value="h1">Titre 1</option>
              <option value="h2">Titre 2</option>
              <option value="h3">Titre 3</option>
              <option value="h4">Titre 4</option>
              <option value="h5">Titre 5</option>
              <option value="h6">Titre 6</option>
            </select>
          </div>
          
          <h4>Contenu</h4>
          <textarea
            value={selectedBlock.content || ""}
            onChange={(e) => onUpdateBlock(selectedBlock.id, e.target.value)}
            placeholder="Titre..."
            className="heading-textarea-sidebar"
            rows={5}
          />
        </div>
      )}
    </aside>
  );
};