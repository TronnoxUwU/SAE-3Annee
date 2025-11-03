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
      ta.style.height = "auto"; // reset
      ta.style.height = ta.scrollHeight + "px"; // ajuste à la hauteur du contenu
    }
  };

  // Ajuster la hauteur à chaque changement de texte
  useEffect(() => {
    adjustHeight();
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
