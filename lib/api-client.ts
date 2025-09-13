class ApiClient {
  // private baseURL = "http://192.168.18.15:5000/api"
  private baseURL = "https://notesflow-pro-backend.vercel.app/api"

  private token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Network error occurred")
    }
  }

  // Auth methods
  login = (email: string, password: string) =>
    this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

  logout = () => this.request("/auth/logout", { method: "POST" })

  getProfile = () => this.request("/auth/profile")

  verifyToken = () => this.request("/auth/verify")

  // Notes methods
  getNotes = (params: any = {}) => {
    const query = new URLSearchParams(params).toString()
    return this.request(`/notes?${query}`)
  }

  getNote = (id: string) => this.request(`/notes/${id}`)

  createNote = (data: any) =>
    this.request("/notes", {
      method: "POST",
      body: JSON.stringify(data),
    })

  updateNote = (id: string, data: any) =>
    this.request(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })

  deleteNote = (id: string) => this.request(`/notes/${id}`, { method: "DELETE" })

  archiveNote = (id: string, archived: boolean) =>
    this.request(`/notes/${id}/archive`, {
      method: "PATCH",
      body: JSON.stringify({ archived }),
    })

  // Tenant methods
  getTenantInfo = () => this.request("/tenants/info")

  getSubscription = () => this.request("/tenants/subscription")

  upgradeSubscription = (slug: string) => this.request(`/tenants/${slug}/upgrade`, { method: "POST" })

  getDashboard = () => this.request("/tenants/dashboard")

  getTenantUsers = () => this.request("/tenants/users")
}

export const apiClient = new ApiClient()
