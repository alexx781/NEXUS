type DashboardProps = {
    onNavigate: (page: string) => void
    onLogout: () => void
}

function Dashboard({ onNavigate, onLogout }: DashboardProps) {
    return (
        <div>
            <h2>Dashboard</h2>

            <nav>
                <button onClick={() => onNavigate("dashboard")}>
                    Dashboard
                </button>

                <button onClick={() => onNavigate("candidates")}>
                    Candidats
                </button>

                <button onClick={() => onNavigate("clients")}>
                    Clients
                </button>

                <button onClick={() => onNavigate("missions")}>
                    Missions
                </button>

                <button onClick={onLogout}>
                    Déconnexion
                </button>
            </nav>
        </div>
    )
}

export default Dashboard