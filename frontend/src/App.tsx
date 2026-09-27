import { useEffect, useState } from "react"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import Candidates from "./components/Candidates"
import Clients from "./components/Clients"
import Missions from "./components/Missions"
import Applications from "./components/Applications"
import type {
  Candidate,
  Client,
  Mission,
  Application,
  Stats,
} from "./types"
import { apiGet } from "./api"

function App() {
  const [token, setToken] = useState("")
  const [page, setPage] = useState("dashboard")

  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<Stats | null>(null)

  async function getCandidates() {
    const data = await apiGet("/candidates", token)
    setCandidates(data)
  }

  async function getClients() {
    const data = await apiGet("/clients", token)
    setClients(data)
  }

  async function getMissions() {
    const data = await apiGet("/missions", token)
    setMissions(data)
  }

  async function getApplications() {
    const data = await apiGet("/applications", token)
    setApplications(data)
  }

  async function getStats() {
    const data = await apiGet("/stats", token)
    setStats(data)
  }

  function logout() {
    setToken("")
    setCandidates([])
    setClients([])
    setMissions([])
    setApplications([])
    setStats(null)
    setPage("dashboard")
  }

  useEffect(() => {
    if (token) {
      getCandidates()
      getClients()
      getMissions()
      getApplications()
      getStats()
    }
  }, [token])

  if (!token) {
    return <Login onLogin={setToken} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="logo">NEXUS</h1>
      </header>

      <div className="app-layout">
        <Dashboard
          onNavigate={setPage}
          onLogout={logout}
        />

        <main className="content">
          {page === "dashboard" && (
            <div>
              <h2>Dashboard</h2>
              <p>Vue d'ensemble de votre activité.</p>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>Candidats</span>
                  <strong>{stats?.candidates ?? 0}</strong>
                </div>

                <div className="stat-card">
                  <span>Clients</span>
                  <strong>{stats?.clients ?? 0}</strong>
                </div>

                <div className="stat-card">
                  <span>Missions</span>
                  <strong>{stats?.missions ?? 0}</strong>
                </div>

                <div className="stat-card">
                  <span>Candidatures</span>
                  <strong>{stats?.applications ?? 0}</strong>
                </div>
              </div>
            </div>
          )}

          {page === "candidates" && (
            <Candidates
              candidates={candidates}
              token={token}
              onCandidateChanged={getCandidates}
            />
          )}

          {page === "clients" && (
            <Clients
              clients={clients}
              token={token}
              onClientCreated={getClients}
            />
          )}

          {page === "missions" && (
            <Missions
              missions={missions}
              clients={clients}
              token={token}
              onMissionCreated={getMissions}
            />
          )}

          {page === "applications" && (
            <Applications
              applications={applications}
              candidates={candidates}
              missions={missions}
              token={token}
              onApplicationCreated={getApplications}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App