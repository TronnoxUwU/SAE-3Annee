"use client";
import { useState } from "react";
import Modal from "@/components/Modal";
import Style from "@/app/styles/connect.module.css";

export default function ForgotPasswordModal({ isOpen, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage("✅ Un lien de réinitialisation t’a été envoyé !");
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.error || "Erreur serveur"}`);
      }
    } catch (err) {
      setMessage("❌ Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Mot de passe oublié</h2>

      <form onSubmit={handleSubmit} className={Style.connect_form}>
        <input
          type="email"
          placeholder="Ton email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer le lien"}
        </button>

        <button
          type="button"
          className={Style.login_switch}
          onClick={() => {
            onClose();
            onSwitchToLogin();
          }}
        >
          Retour à la connexion
        </button>
      </form>

      {message && <p className={Style.login_message}>{message}</p>}
    </Modal>
  );
}
