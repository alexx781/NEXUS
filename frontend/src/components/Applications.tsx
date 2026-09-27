import { useState } from "react"
import type { Application, Candidate, Mission } from "../types"
import { apiPost } from "../api"

type ApplicationsProps = {
    applications: Application[]
    candidates: Candidate[]
    missions: Mission[]
    token: string
    onApplicationCreated: () => void
}

function Applications({
    applications,
    candidates,
    missions,
    token,
    onApplicationCreated,
}: ApplicationsProps) {
    const [candidateId, setCandidateId] = useState("")
    const [missionId, setMissionId] = useState("")

    async function createApplication() {
        if (!candidateId || !missionId) {
            alert("Sélectionne un candidat et une mission")
            return
        }

        try {
            await apiPost("/applications", token, {
                candidate_id: Number(candidateId),
                mission_id: Number(missionId),
                status: "proposed",
            })

            setCandidateId("")
            setMissionId("")

            onApplicationCreated()
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
          }
    }

    return (
        <div>
            <h2>Candidatures</h2>

            <div className="form-card">
                <h3>Proposer un candidat</h3>

                <div className="form-row">
                    <select
                        value={candidateId}
                        onChange={(event) => setCandidateId(event.target.value)}
                    >
                        <option value="">Sélectionner un candidat</option>

                        {candidates.map((candidate) => (
                            <option key={candidate.id} value={candidate.id}>
                                {candidate.first_name} {candidate.last_name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={missionId}
                        onChange={(event) => setMissionId(event.target.value)}
                    >
                        <option value="">Sélectionner une mission</option>

                        {missions.map((mission) => (
                            <option key={mission.id} value={mission.id}>
                                {mission.title} — {mission.client_name}
                            </option>
                        ))}
                    </select>

                    <button
                        className="primary-button"
                        onClick={createApplication}
                    >
                        Proposer
                    </button>
                </div>
            </div>

            <h3>Liste des candidatures</h3>

            {applications.map((application) => (
                <div className="card" key={application.id}>
                    <strong>{application.candidate}</strong>
                    <p>Mission : {application.mission}</p>
                    <p>Client : {application.client}</p>
                    <p>Statut : {application.status}</p>
                </div>
            ))}
        </div>
    )
}

export default Applications