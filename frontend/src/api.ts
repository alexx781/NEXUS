const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8001"

export async function apiLogin(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.detail || "Login failed")
    }

    return data
}

export async function apiGet(path: string, token: string) {
    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
    }

    return response.json()
}

export async function apiPost(
    path: string,
    token: string,
    body: unknown
) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.detail || `API error: ${response.status}`)
    }

    return data
}
  
export async function apiPut(
    path: string,
    token: string,
    body: unknown
) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  }