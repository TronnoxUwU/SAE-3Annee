"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "../components/Modal";
import '../styles/login.css';
import '../styles/modal.css';

export default function LoginModal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isOpen, setIsOpen] = useState(false);
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

    setIsOpen(false);
    router.push(res.url || "/");
  };


  return (
    <>
      <button className="connect" onClick={() => setIsOpen(true)}>
        <p>Se connecter</p>
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {!session ? (
          <>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit} className="login-form">
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
            </form>
            {message && <p className="login-message">{message}</p>}
          </>
        ) : (
          <div className="login-session">
            <p>Connecté en tant que {session.user.email}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
