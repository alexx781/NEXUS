import { useState } from "react"
import type { Client } from "../types"
import { apiPost } from "../api"

type ClientsProps = {
    clients: Client[]
    token: string
    onClientCreated: () => void
}

function Clients({
    clients,
    token,
    onClientCreated,
}: ClientsProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    async function createClient() {
        await apiPost("/clients", token, {
            name,
            email: email || null,
            phone: phone || null,
        })

        setName("")
        setEmail("")
        setPhone("")

        onClientCreated()
    }

    return (
        <div>
            <h2>Clients</h2>

            <div className="form-card">
                <h3>Ajouter un client</h3>

                <div className="form-row">
                    <input
                        placeholder="Nom du client"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <input
                        placeholder="Téléphone"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                    />

                    <button
                        className="primary-button"
                        onClick={createClient}
                    >
                        Ajouter
                    </button>
                </div>
            </div>

            <h3>Liste des clients</h3>

            {clients.map((client) => (
                <div className="card" key={client.id}>
                    <strong>{client.name}</strong>
                    <p>{client.email || "Aucun email"}</p>
                    <p>{client.phone || "Aucun téléphone"}</p>
                </div>
            ))}
        </div>
    )
}

export default Clients