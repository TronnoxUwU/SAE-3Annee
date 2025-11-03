"use client";
import React, { useState } from "react";

interface TitreProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export const Titre: React.FC<TitreProps> = ({
  value,
  onChange,
  placeholder = "Saisissez un titre...",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const displayText = !isFocused && !value ? placeholder : value;
  const isPlaceholder = !isFocused && !value;

  return (
    <h2
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        setIsFocused(false);
        onChange(e.currentTarget.textContent || "");
      }}
      style={{
        outline: "none",
        cursor: "text",
        color: isPlaceholder ? "#888" : "#000", // gris → noir
        fontStyle: isPlaceholder ? "italic" : "normal",
      }}
    >
      {displayText}
    </h2>
  );
};
