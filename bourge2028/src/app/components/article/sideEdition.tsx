import React, { useRef } from "react";

export const Sidebar = ({ selectedBlock, onUpdateBlock, paragraphRefs }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (command: string) => {
    // 1️⃣ Cas : formatage depuis la Sidebar (textarea)
    if (textareaRef.current && document.activeElement === textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end);

      if (!selectedText) {
        alert("Veuillez sélectionner du texte à formater");
        return;
      }

      const tagMap = { bold: "strong", italic: "em", underline: "u" };
      const tag = tagMap[command] || command;

      const openTag = `<${tag}>`;
      const closeTag = `</${tag}>`;
      const newText =
        text.substring(0, start) +
        openTag +
        selectedText +
        closeTag +
        text.substring(end);

      onUpdateBlock(selectedBlock.id, newText);

      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + openTag.length + selectedText.length + closeTag.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
      return;
    }

    // 2️⃣ Cas : formatage dans le paragraphe contentEditable
    const paragraphHandle = paragraphRefs.current[selectedBlock.id];
    if (paragraphHandle?.applyFormat) {
      paragraphHandle.applyFormat(
        command === "bold" ? "strong" :
        command === "italic" ? "em" :
        command === "underline" ? "u" : command
      );
    }
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
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("bold")}
                className="format-btn"
                title="Gras"
              >
                <strong>B</strong>
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("italic")}
                className="format-btn"
                title="Italique"
              >
                <em>I</em>
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("underline")}
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
                const newLevel = e.target.value as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                onUpdateBlock(selectedBlock.id, selectedBlock.content, { headingLevel: newLevel });
              }}
              className="heading-level-select"
            >
              <option value="h2">Titre 1</option>
              <option value="h3">Titre 2</option>
              <option value="h4">Titre 3</option>
              <option value="h5">Titre 4</option>
              <option value="h6">Titre 5</option>
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