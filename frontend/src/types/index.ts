export type Candidate = {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string | null
    job: string
    status: string
}
  
export type Client = {
    id: number
    name: string
    email: string | null
    phone: string | null
}

export type Mission = {
    id: number
    title: string
    description: string | null
    status: string
    client_id: number
    client_name: string
}

export type Application = {
    id: number
    candidate: string
    mission: string
    client: string
    status: string
}
  
export type Stats = {
    candidates: number
    clients: number
    missions: number
    applications: number
  }