import { useState } from "react"
import type { Mission, Client } from "../types"
import { apiPost } from "../api"

type MissionsProps = {
    missions: Mission[]
    clients: Client[]
    token: string
    onMissionCreated: () => void
}

function Missions({
    missions,
    clients,
    token,
    onMissionCreated,
}: MissionsProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [clientId, setClientId] = useState("")
    const [status, setStatus] = useState("open")

    async function createMission() {
        if (!clientId) {
            alert("Sélectionne un client")
            return
        }

        await apiPost("/missions", token, {
            title,
            description: description || null,
            status,
            client_id: Number(clientId),
        })

        setTitle("")
        setDescription("")
        setClientId("")
        setStatus("open")

        onMissionCreated()
    }

    return (
        <div>
            <h2>Missions</h2>

            <div className="form-card">
                <h3>Ajouter une mission</h3>

                <div className="form-row">
                    <input
                        placeholder="Titre de la mission"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />

                    <input
                        placeholder="Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />

                    <select
                        value={clientId}
                        onChange={(event) => setClientId(event.target.value)}
                    >
                        <option value="">Sélectionner un client</option>

                        {clients.map((client) => (
                            <option
                                key={client.id}
                                value={client.id}
                            >
                                {client.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value="open">Ouverte</option>
                        <option value="filled">Pourvue</option>
                        <option value="closed">Fermée</option>
                    </select>

                    <button
                        className="primary-button"
                        onClick={createMission}
                    >
                        Ajouter
                    </button>
                </div>
            </div>

            <h3>Liste des missions</h3>

            {missions.map((mission) => (
                <div className="card" key={mission.id}>
                    <strong>{mission.title}</strong>
                    <p>Client : {mission.client_name}</p>
                    <p>{mission.description || "Aucune description"}</p>
                    <p>Statut : {mission.status}</p>
                </div>
            ))}
        </div>
    )
}

export default Missions