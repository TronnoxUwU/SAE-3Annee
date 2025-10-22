"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Styles from "./Topbar.module.css";
import RegisterModal from '../app/components/connect/RegisterModal';
import LoginModal from '../app/components/connect/LoginModal';

export default function Topbar({ title = "Bourges 2028", fixed = false }) {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header 
      className={`${Styles.topbar} ${
          fixed ? Styles.topbar_fixed : Styles.topbar_bloc
        }`}
    >
      <h1>{title}</h1>

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
