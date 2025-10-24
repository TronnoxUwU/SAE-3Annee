"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Styles from "./Topbar.module.css";
import RegisterModal from "../app/components/connect/RegisterModal";
import LoginModal from "../app/components/connect/LoginModal";

export default function Topbar({ title = "Bourges 2028", fixed = false }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleNavigation = (path) => {
    router.push(path);
    setMenuOpen(false);
  };

  // Ferme le menu si on clique à l’extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`${Styles.topbar} ${fixed ? Styles.topbar_fixed : Styles.topbar_bloc
        }`}
    >
      <div className={Styles.leftSection} ref={menuRef}>
        {/* Image cliquable */}
        <div
          className={Styles.menuIcon}
          onClick={() => setMenuOpen(!menuOpen)}
          role="button"
          aria-label="Ouvrir le menu"
        >
          <div className={Styles.menuIcon}>
            <Image src="/menu.svg" alt="Menu" width={35} height={35} />
          </div>

        </div>

        {/* Menu déroulant sous l’image */}
        {menuOpen && (
          <div className={Styles.dropdown}>
            <ul>
              <li onClick={() => handleNavigation("/")}>Accueil</li>
              <li onClick={() => handleNavigation("/annuaire")}>Annuaire</li>
              {session && session.user.role === "Admin" && ( // à adapter
                <li onClick={() => handleNavigation("/admin")}>Administration</li>
              )}
              {session && (
                <li onClick={() => handleNavigation("/user")}>Ma structure</li>
              )}
            </ul>
          </div>
        )}

        <h1>{title}</h1>
      </div>

      {/* Connexion / déconnexion */}
      {!session ? (
        <div style={{ display: "flex", gap: "10px" }}>
          <LoginModal />
          <RegisterModal />
        </div>
      ) : (
        <button className={Styles.connect} onClick={handleLogout}>
          <p>Se déconnecter</p>
        </button>
      )}
    </header>
  );
}
