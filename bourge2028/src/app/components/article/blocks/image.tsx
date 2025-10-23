"use client";

import React from "react";

interface ImageBlockProps {
  src?: string;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ src }) => {
  return (
    <img
      src={src || "https://via.placeholder.com/300"}
      alt="placeholder"
      style={{ maxWidth: "100%", display: "block" }}
    />
  );
};