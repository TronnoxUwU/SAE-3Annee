"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Style from "@/app/styles/connect.module.css";

function RegisterPageContent({ onSwitchToLogin }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [identifiant, setIdentifiant] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identifiant,
                nom,
                prenom,
                email,
                password,
                role: "User",
            }),
        });
        const data = await res.json();
        if (res.ok) {
            setMessage("✅ Compte créé, vous pouvez maintenant vous connecter");
            setShowSuccessPopup(true);
            
            // Redirection après 5 secondes
            setTimeout(() => {
                setShowSuccessPopup(false);
                router.push("/?showLogin=true");
            }, 5000);
        } else {
            setMessage(`❌ ${data.error}`);
        }
    }

    const handleBackToLogin = (e) => {
        e.preventDefault();
        if (onSwitchToLogin) {
            onSwitchToLogin();
        } else {
            router.push("/");
        }
    };

    return (
        <div className={Style.connect_container}>
            <div className={Style.connect_wrapper}>
                <h2>Créer un compte</h2>
                <form onSubmit={handleSubmit} className={Style.connect_form}>
                    <input
                        type="text"
                        placeholder="Identifiant"
                        value={identifiant}
                        onChange={(e) => setIdentifiant(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Prénom"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Créer un compte</button>

                    <a href="/">
                        <button
                            type="button"
                            className={Style.login_switch}
                        >
                            Retourner à la carte
                        </button>
                    </a>
                </form>

                {message && !showSuccessPopup && (
                    <p className={Style.connect_message}>{message}</p>
                )}
            </div>

            {/* Pop-up de succès */}
            {showSuccessPopup && (
                <div className={Style.popup_overlay}>
                    <div className={Style.popup_content}>
                        <div className={Style.popup_icon}>✅</div>
                        <h3>Compte créé avec succès !</h3>
                        <p>Vous allez être redirigé vers la page de connexion...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function RegisterPage(props) {
    return (
        <Suspense fallback={null}>
            <RegisterPageContent {...props} />
        </Suspense>
    );
}