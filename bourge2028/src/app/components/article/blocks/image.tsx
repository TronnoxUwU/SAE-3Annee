"use client";
import React from "react";

interface ImageBlockProps {
  src: string;
  onChange: (src: string) => void;
}

export const Image: React.FC<ImageBlockProps> = ({ src, onChange }) => {
  return (
    <div style={{ textAlign: "center" }}>
      {src ? (
        <img src={src} alt="block" style={{ maxWidth: "100%", borderRadius: "8px" }} />
      ) : (
        <div style={{ background: "#eee", padding: "30px" }}>📷 Aucune image</div>
      )}
      <input
        type="text"
        placeholder="URL de l'image"
        value={src}
        onChange={(e) => onChange(e.target.value)}
        style={{ marginTop: "10px", width: "80%" }}
      />
    </div>
  );
};
