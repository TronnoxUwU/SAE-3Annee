"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import RegisterModal from "./RegisterModal";
import Modal from "./Modal";
import Style from './connect.module.css';
import TopStyle from "@/components/Topbar.module.css"
// ...
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function LoginModal() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentUrl = `${pathname}?${searchParams.toString()}`;
  const callbackUrl = currentUrl || "/";

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

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
      <button className={TopStyle.connect} onClick={() => setShowLogin(true)}>
        <p>Se connecter</p>
      </button>

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
                type="button"
                className={Style.login_switch}
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                Créer un compte
              </button>

              <button
                type="button"
                className={Style.login_switch}
                onClick={() => {
                  setShowLogin(false);
                  setShowForgot(true);
                }}
              >
                Mot de passe oublié ?
              </button>
            </form>

            {message && <p className={Style.login_message}>{message}</p>}
          </>
        ) : (
          <div className="login_session">
            <p>Connecté en tant que {session.personne.email}</p>
          </div>
        )}
      </Modal>

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />

      {/* 👇 Et ton nouveau modal */}
      <ForgotPasswordModal
        isOpen={showForgot}
        onClose={() => setShowForgot(false)}
        onSwitchToLogin={() => setShowLogin(true)}
      />
    </>
  );
}
