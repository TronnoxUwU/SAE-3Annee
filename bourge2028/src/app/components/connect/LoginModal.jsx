"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import RegisterModal from "./RegisterModal";
import Modal from "@/components/Modal";
import Style from './connect.module.css';
import TopStyle from "@/components/Topbar.module.css"

export default function LoginModal() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentUrl = `${pathname}?${searchParams.toString()}`;
  const callbackUrl = currentUrl || "/";

  // --- États globaux ---
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // --- Formulaire Login ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    if (res.error) {
      setMessage("❌ Email ou mot de passe incorrect");
      return;
    }

    setShowLogin(false);
    router.push(res.url || "/");
  };

  return (
    <>
      {/* --- Bouton principal --- */}
      <button className={TopStyle.connect} onClick={() => setShowLogin(true)}>
        <p>Se connecter</p>
      </button>

      {/* --- Modal Connexion --- */}
      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        {!session ? (
          <>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit} className={Style.connect_form}>
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
              <button type="submit">Se connecter</button>

              <button
                className={Style.login_switch}
                onClick={() => {
                  setShowLogin(false);  // ferme login
                  setShowRegister(true); // ouvre register
                }}
              >
                Créer un compte
              </button>

            </form>

            {message && <p className="login_message">{message}</p>}
          </>
        ) : (
          <div className="login_session">
            <p>Connecté en tant que {session.personne.email}</p>
          </div>
        )}
      </Modal>

      {/* --- Register Modal --- */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}
