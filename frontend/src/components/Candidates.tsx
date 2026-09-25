import type { Candidate } from "../types"

type CandidatesProps = {
    candidates: Candidate[]
}

function Candidates({ candidates }: CandidatesProps) {
    return (
        <div>
            <h2>Candidats</h2>

            {candidates.map((candidate) => (
                <div key={candidate.id}>
                    <strong>
                        {candidate.first_name} {candidate.last_name}
                    </strong>

                    <p>{candidate.job}</p>
                    <p>{candidate.email}</p>
                    <p>Statut : {candidate.status}</p>
                </div>
            ))}
        </div>
    )
}

export default Candidates