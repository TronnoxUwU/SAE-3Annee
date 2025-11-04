"use client";
import React, { useRef, useEffect } from "react";

interface ParagrapheProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export const Paragraphe: React.FC<ParagrapheProps> = ({
  value,
  onChange,
  placeholder = "Écrivez votre texte ici...",
}) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // Synchroniser le contenu HTML avec la prop value
  useEffect(() => {
    const div = contentEditableRef.current;
    if (div && div.innerHTML !== value) {
      div.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    const div = contentEditableRef.current;
    if (div) {
      onChange(div.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div
      ref={contentEditableRef}
      contentEditable
      className="paragraph-contenteditable"
      onInput={handleInput}
      onPaste={handlePaste}
      data-placeholder={placeholder}
      suppressContentEditableWarning
      style={{
        width: "100%",
        minHeight: "60px",
        outline: "none",
        cursor: "text",
        padding: "8px 0",
        lineHeight: "1.6",
      }}
    />
  );
};