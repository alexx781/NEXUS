import { useState } from "react"
import { apiLogin } from "../api"

type LoginProps = {
  onLogin: (token: string) => void
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function login() {
    try {
      const data = await apiLogin(email, password)
      onLogin(data.access_token)
    } catch {
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