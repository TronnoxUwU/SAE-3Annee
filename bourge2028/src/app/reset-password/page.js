"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Style from "@/app/styles/register.module.css";
import Topbar from "@/components/Topbar";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("❌ Lien invalide");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas");
      return;
    }

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
        router.push("/?showLogin=true");
      }, 5000);
    } else {
      setMessage(`❌ ${data.error}`);
    }
  }

  return (
    <div>
      <Topbar />
      <div className={Style.connect_container}>
        <div className={Style.connect_wrapper}>
          <h2>Réinitialiser le mot de passe</h2>

          <form onSubmit={handleSubmit} className={Style.connect_form}>
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit">Mettre à jour le mot de passe</button>

            <button
              type="button"
              className={Style.login_switch}
              onClick={() => router.push("/")}
            >
              Retour à l’accueil
            </button>
          </form>

          {message && !showSuccessPopup && (
            <p className={Style.connect_message}>{message}</p>
          )}
        </div>

        {showSuccessPopup && (
          <div className={Style.popup_overlay}>
            <div className={Style.popup_content}>
              <div className={Style.popup_icon}>✅</div>
              <h3>Mot de passe mis à jour</h3>
              <p>Redirection vers la page de connexion…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
