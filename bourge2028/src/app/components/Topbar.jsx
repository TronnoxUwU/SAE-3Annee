"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import "../styles/Topbar.css";

export default function Topbar({ title = "Bourges 2028" }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogin = () => {
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  };

  const handleRegister = () => {
    router.push(`/register?callbackUrl=${encodeURIComponent(pathname)}`);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: pathname });
  };

  return (
    <header className="topbar">
      <h1>{title}</h1>

      {!session ? (
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="connect" onClick={handleLogin}>
            <p>Se connecter</p>
          </button>
          <button className="connect" onClick={handleRegister}>
            <p>Créer un compte</p>
          </button>
        </div>
      ) : (
        <button className="connect" onClick={handleLogout}>
          <p>Se déconnecter</p>
        </button>
      )}
    </header>
  );
}
