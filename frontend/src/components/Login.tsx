import { useState } from "react"

type LoginProps = {
    onLogin: (token: string) => void
}

function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("alex@nexus.local")
    const [password, setPassword] = useState("NexusTest123!")

    async function login() {
        const response = await fetch("http://127.0.0.1:8001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })

        const data = await response.json()

        if (response.ok) {
            onLogin(data.access_token)
        } else {
            alert("Email ou mot de passe incorrect")
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="logo">NEXUS</h1>
                <h2>Connexion</h2>

                <p style={{ marginBottom: "24px", color: "#64748b" }}>
                    Connectez-vous à votre espace de recrutement.
                </p>

                <input
                    type="email"
                    placeholder="Adresse email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button
                    className="primary-button"
                    onClick={login}
                >
                    Se connecter
                </button>
            </div>
        </div>
    )
}

export default Login