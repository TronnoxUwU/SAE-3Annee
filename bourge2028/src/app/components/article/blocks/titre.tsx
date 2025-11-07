"use client";

import React, { useRef, useEffect } from "react";

interface TitreProps {
  value: string;
  onChange: (value: string) => void;
  level?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Titre: React.FC<TitreProps> = ({ value, onChange, level = 'h1' }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const getFontSize = () => {
    switch(level) {
      case 'h2': return '2em';
      case 'h3': return '1.75em';
      case 'h4': return '1.5em';
      case 'h5': return '1.25em';
      case 'h6': return '1em';
      default: return '2em';
    }
  };

  // Auto-resize du textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='Entrez votre titre...'
      className="heading-textarea"
      style={{
        fontSize: getFontSize(),
        fontWeight: 'bold',
        border: 'none',
        outline: 'none',
        width: '100%',
        background: 'transparent',
        padding: '8px 0',
        fontFamily: 'inherit',
        resize: 'none',
        overflow: 'hidden',
        minHeight: getFontSize(),
        lineHeight: '1.2',
      }}
    />
  );
};