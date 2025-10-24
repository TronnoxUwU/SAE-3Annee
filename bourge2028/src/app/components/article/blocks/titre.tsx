"use client";

import React from "react";

interface HeadingBlockProps {
  content?: string;
}

export const Titre: React.FC<HeadingBlockProps> = ({ content }) => {
  return <h2>{content || "Votre titre ici !!!!"}</h2>;
};

