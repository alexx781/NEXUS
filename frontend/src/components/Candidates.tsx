import { useState } from "react"
import type { Candidate } from "../types"
import { apiPost, apiPut } from "../api"

type CandidatesProps = {
    candidates: Candidate[]
    token: string
    onCandidateChanged: () => void
}

function Candidates({
    candidates,
    token,
    onCandidateChanged,
}: CandidatesProps) {
    const [editingId, setEditingId] = useState<number | null>(null)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [job, setJob] = useState("")

    function resetForm() {
        setEditingId(null)
        setFirstName("")
        setLastName("")
        setEmail("")
        setPhone("")
        setJob("")
    }

    function startEditing(candidate: Candidate) {
        setEditingId(candidate.id)
        setFirstName(candidate.first_name)
        setLastName(candidate.last_name)
        setEmail(candidate.email)
        setPhone(candidate.phone ?? "")
        setJob(candidate.job)
    }

    async function saveCandidate() {
        const candidateData = {
            first_name: firstName,
            last_name: lastName,
            email,
            phone: phone || null,
            job,
            status: "available",
        }

        if (editingId === null) {
            await apiPost("/candidates", token, candidateData)
        } else {
            await apiPut(`/candidates/${editingId}`, token, candidateData)
        }

        resetForm()
        onCandidateChanged()
    }

    return (
        <div>
            <h2>Candidats</h2>

            <div className="form-card">
                <h3>
                    {editingId === null
                        ? "Ajouter un candidat"
                        : "Modifier le candidat"}
                </h3>

                <div className="form-row">
                    <input
                        placeholder="Prénom"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                    />

                    <input
                        placeholder="Nom"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                    />

                    <input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <input
                        placeholder="Téléphone"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                    />

                    <input
                        placeholder="Métier"
                        value={job}
                        onChange={(event) => setJob(event.target.value)}
                    />

                    <button
                        className="primary-button"
                        onClick={saveCandidate}
                    >
                        {editingId === null ? "Ajouter" : "Enregistrer"}
                    </button>

                    {editingId !== null && (
                        <button
                            className="secondary-button"
                            onClick={resetForm}
                        >
                            Annuler
                        </button>
                    )}
                </div>
            </div>

            <h3>Liste des candidats</h3>

            {candidates.map((candidate) => (
                <div className="card" key={candidate.id}>
                    <strong>
                        {candidate.first_name} {candidate.last_name}
                    </strong>

                    <p>{candidate.job}</p>
                    <p>{candidate.email}</p>
                    <p>Statut : {candidate.status}</p>

                    <button
                        className="secondary-button"
                        onClick={() => startEditing(candidate)}
                    >
                        Modifier
                    </button>
                </div>
            ))}
        </div>
      )
}

export default Candidates