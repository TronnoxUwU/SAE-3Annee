"use client";

import React from "react";

interface ParagraphBlockProps {
  content?: string;
}

export const Paragraphe: React.FC<ParagraphBlockProps> = ({ content }) => {
  return <p>{content || "Votre paragraphe ici…"}</p>;
};