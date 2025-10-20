"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "../components/Modal";
import "../styles/register.css";
import "../styles/modal.css";

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role: "User" }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Compte créé, vous pouvez maintenant vous connecter");
      onClose?.();
      onSwitchToLogin?.(); // ouvre le modal de login
    } else {
      setMessage(`❌ ${data.error}`);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Créer un compte</button>
      </form>

      <button className="login-switch" onClick={onSwitchToLogin}>
        Retourner à la connexion
      </button>

      {message && <p className="register-message">{message}</p>}
    </Modal>
  );
}
