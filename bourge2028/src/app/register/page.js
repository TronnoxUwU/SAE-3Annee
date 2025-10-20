"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
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
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Compte créé, vous pouvez maintenant vous connecter");
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } else {
      setMessage(`❌ ${data.error}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
        <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded" />
        <button className="bg-green-600 text-white p-2 rounded">Créer un compte</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
