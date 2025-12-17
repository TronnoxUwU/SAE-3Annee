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
  const [accountOpen, setAccountOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);
  const accountRef = useRef(null);
  const [userData, setUserData] = useState(null);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Ferme les menus si on clique à l'extérieur
  useEffect(() => {

    async function fetchUser() {
      try {
        const response = await fetch(`/api/users/${session.user?.id}`);
        if (!response.ok) throw new Error("Utilisateur non trouvé");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Erreur lors du chargement utilisateur :", error);
      }
    }

    if (session?.user?.id) fetchUser();


    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`${Styles.topbar} ${
        fixed ? Styles.topbar_fixed : Styles.topbar_bloc
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
          <Image src="/menu.svg" alt="Menu" width={35} height={35} />
        </div>

        {/* Menu déroulant général */}
        {menuOpen && (
          <div className={Styles.dropdown}>
            <ul>
              <li>
                <a href="/">Accueil</a>
              </li>
              <li>
                <a href="/annuaires">Annuaires</a>
              </li>
              <li>
                <a href="/information">Informations</a>
              </li>
              <li>
                <a href="/structure">Structures</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/credit">Crédits</a>
              </li>
              <li>
                <a href="/legal">Mentions légales</a>
              </li>
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
        <div className={Styles.menuAccount} ref={accountRef}>
          <button
            className={Styles.connect}
            onClick={() => setAccountOpen(!accountOpen)}
          >
            {/* Avatar */}
            {session && session.user && (
            <div className={Styles.avatarSection}>
              <div className={Styles.avatar}>
                <div className={Styles.defaultAvatar}>
                  {session.user.prenom?.[0]}
                  {session.user.nom?.[0]}
                </div>
              </div>
            </div>
          )}

            <p>Mon compte</p>
          </button>

          {/* Menu déroulant compte */}
          {accountOpen && (
            <div className={Styles.dropdown}>
              <ul>
                {session && session.user && (
                  <li>
                    <a href={`/account/${session.user.id}`}>
                      Mon compte
                    </a>
                  </li>
                )}
                {session && session.user.structure != null && (
                  <li>
                    <a href={`/structure/${session.user.structure}`}>
                      Ma structure
                    </a>
                  </li>
                )}
                {session && session.user.role === "Admin" && (
                  <li>
                    <a href="/admin">Administration</a>
                  </li>
                )}
                <li>
                  <a onClick={handleLogout} style={{ cursor: "pointer" }}>
                    Se déconnecter
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </header>
  );
}