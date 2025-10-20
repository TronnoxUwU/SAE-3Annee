"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import '../styles/Topbar.css';
import RegisterModal from './register/RegisterModal';
import LoginModal from './login/LoginModal';

export default function Topbar({ title = "Bourges 2028" }) {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="topbar">
      <h1>{title}</h1>

      {!session ? (
        <div style={{ display: "flex", gap: "10px" }}>
          <LoginModal />
          <RegisterModal />
        </div>
      ) : (
        <button className="connect" onClick={handleLogout}>
          <p>Se déconnecter</p>
        </button>
      )}
    </header>
  );
}
