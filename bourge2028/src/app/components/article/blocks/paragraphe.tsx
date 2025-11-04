"use client";
import React, { useState, useRef, useEffect } from "react";

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
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isPlaceholder = !isFocused && !value;

  // Ajuste la hauteur automatiquement
  const adjustHeight = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  // Fonction pour appliquer le formatage
  const applyFormatting = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    if (!selectedText) return; // Rien de sélectionné

    const openTag = `<${tag}>`;
    const closeTag = `</${tag}>`;
    const newText = 
      value.substring(0, start) +
      openTag + selectedText + closeTag +
      value.substring(end);

    onChange(newText);

    // Remettre le focus et la sélection après le changement
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + openTag.length + selectedText.length + closeTag.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Exposer la fonction pour que la sidebar puisse l'utiliser
  useEffect(() => {
    if (textareaRef.current) {
      (textareaRef.current as any).applyFormatting = applyFormatting;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="paragraph-textarea"
      value={value}
      placeholder={placeholder}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        outline: "none",
        cursor: "text",
        resize: "none",
        overflow: "hidden",
        color: isPlaceholder ? "#888" : "#000",
        fontStyle: isPlaceholder ? "italic" : "normal",
      }}
    />
  );
};