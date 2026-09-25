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
            alert("Connexion réussie !")
        } else {
            alert("Email ou mot de passe incorrect")
        }
    }

    return (
        <div>
            <h2>Connexion</h2>

            <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />

            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <button onClick={login}>
                Se connecter
            </button>
        </div>
    )
}

export default Login