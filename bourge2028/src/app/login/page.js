"use client";

import { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
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

    router.push(res.url || "/");
  };

  if (status === "loading") return <p>Chargement...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Connexion</h1>

      {!session ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          <button className="bg-blue-600 text-white p-2 rounded">
            Se connecter
          </button>
        </form>
      ) : (
        <div>
          <p>Connecté en tant que {session.user.email}</p>
        </div>
      )}

      <p>{message}</p>
    </div>
  );
}
