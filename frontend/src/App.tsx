import { useEffect, useState } from "react"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import Candidates from "./components/Candidates"
import type { Candidate } from "./types"

function App() {
  const [token, setToken] = useState("")
  const [page, setPage] = useState("dashboard")
  const [candidates, setCandidates] = useState<Candidate[]>([])

  async function getCandidates() {
    const response = await fetch("http://127.0.0.1:8001/candidates", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    setCandidates(data)
  }

  function logout() {
    setToken("")
    setCandidates([])
    setPage("dashboard")
  }

  useEffect(() => {
    if (token) {
      getCandidates()
    }
  }, [token])

  return (
    <div>
      <h1>NEXUS</h1>

      {!token ? (
        <Login onLogin={setToken} />
      ) : (
        <div>
          <Dashboard
            onNavigate={setPage}
            onLogout={logout}
          />

          {page === "dashboard" && (
            <div>
              <h2>Bienvenue sur NEXUS</h2>
              <p>Système de gestion de recrutement</p>
            </div>
          )}

          {page === "candidates" && (
            <Candidates candidates={candidates} />
          )}

          {page === "clients" && (
            <h2>Clients</h2>
          )}

          {page === "missions" && (
            <h2>Missions</h2>
          )}
        </div>
      )}
    </div>
  )
}

export default App