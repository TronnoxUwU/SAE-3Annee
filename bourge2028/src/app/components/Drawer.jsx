"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Drawer({ children, closePath, transitionDuration = 600 }) {
  const router = useRouter();
  const [animate, setAnimate] = useState(false);

  // Animation du drawer dès le premier rendu
  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => router.push(closePath, { shallow: true }), transitionDuration);
  };

  return (
    <>
      <section className={`section-annuaire ${animate ? "show" : ""}`}>
        {children}
      </section>
      <button
        className={`toggle-btn ${animate ? "top" : "bottom"}`}
        onClick={handleClose}
      >
        {animate ? "Revenir à la carte ↑" : "Aller à l’Annuaire ↓"}
      </button>
    </>
  );
}
