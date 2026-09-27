type DashboardProps = {
    onNavigate: (page: string) => void
    onLogout: () => void
}

function Dashboard({ onNavigate, onLogout }: DashboardProps) {
    return (
        <aside className="sidebar">
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

                <button onClick={() => onNavigate("applications")}>
                    Candidatures
                </button>

                <button
                    className="logout-button"
                    onClick={onLogout}
                >
                    Déconnexion
                </button>
            </nav>
        </aside>
    )
}

export default Dashboard