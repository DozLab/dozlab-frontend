import { defineStore } from 'pinia'

// Types and a typed client for the lab endpoints of dozlab-api. Field names are the API's own
// (snake_case JSON), from dozlab-api `api-contracts.md` ("Lab Management") and the handlers in
// `internal/api/handlers/lab.go` and `lab_session.go`.

export type LabDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Lab {
  id: string
  name: string
  slug: string
  description?: string
  difficulty_level: LabDifficulty
  estimated_duration?: number // minutes
  category?: string
  tags?: string[]
  is_published: boolean
  init_image?: string
  // VM size for every session of the lab; a session request can't set it
  vm_vcpus: number // 1–8
  vm_memory_mib: number // 256–16384
  vm_disk_gib: number // 1–100
  created_by?: string
  created_at: string
  updated_at: string
  version: number
}

// POST /labs
export interface CreateLabRequest {
  name: string
  slug: string
  description?: string
  difficulty_level?: LabDifficulty
  estimated_duration?: number
  category?: string
  tags?: string[]
  is_published?: boolean
  init_image?: string
  vm_vcpus?: number
  vm_memory_mib?: number
  vm_disk_gib?: number
}

// PUT /labs/{labId}: only the fields sent are changed
export type UpdateLabRequest = Partial<Omit<CreateLabRequest, 'slug' | 'init_image'>>

export interface ListLabsParams {
  page?: number
  limit?: number // up to 100; the API's default is 20
  category?: string
}

export interface ListLabsResponse {
  labs: Lab[]
  pagination: { page: number, limit: number, total: number }
}

export type LabSessionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'expired'

export interface LabSession {
  id: string
  user_id: string
  lab_id: string
  lab_spec_id?: string
  status: LabSessionStatus
  started_at?: string
  completed_at?: string
  expires_at?: string
  created_at: string
  updated_at: string
  lab?: Lab
}

// What the cluster reports for a session (GET /lab-sessions/{id})
export interface K8sSessionStatus {
  phase: string
  message: string
  pod_name?: string
  pod_ip?: string
  vm_ip?: string
  endpoints?: Record<string, string>
  conditions?: { type: string, status: string, message?: string }[]
}

// POST /lab-sessions
export interface CreateLabSessionRequest {
  lab_id: string
  config?: {
    vscode_password?: string
    enable_terminal?: boolean
    enable_vscode?: boolean
    enable_ssh?: boolean
  }
  timeout?: string
}

// The API answers 202 before the session is running, and returns the password only here
export interface CreateLabSessionResponse {
  message: string
  session: LabSession
  credentials: { vscode_password: string }
}

export interface GetLabSessionResponse {
  session: LabSession
  k8s_status: K8sSessionStatus | null
}

// CPU in thousandths of a core, memory in MiB
export interface ResourceAmount {
  cpu_millicores: number
  memory_mib: number
}

// GET /labs/{labId}/estimate: what one VM of the lab reserves and stores. `reserved` is what the
// cluster sets aside; `maximum` is the most the VM may use.
export interface LabEstimate {
  persistence: Persistence
  vm: { vcpus: number, memory_mib: number, disk_gib: number }
  containers: { name: string, purpose: string, reserved: ResourceAmount, maximum: ResourceAmount }[]
  total: { reserved: ResourceAmount, maximum: ResourceAmount }
  devices: Record<string, number>
  storage: {
    while_running: { name: string, purpose: string, kind: 'volume' | 'node-local', size_mib: number }[]
    volumes_mib: number
    node_local_limit_mib: number
    after_stop_mib: number
  }
}

// The only session option the API accepts today
export type Persistence = 'none'

// What one VM holds in the cluster. CPU and memory while `running`; storage until it is deleted.
export interface VMUsage extends ResourceAmount {
  running: boolean
  storage_mib: number
}

export interface UsageTotal extends ResourceAmount {
  vms: number
  running_vms: number
  storage_mib: number
}

// GET /lab-sessions/usage: the caller's VMs per lab (an admin gets everyone's)
export interface UsageReport {
  labs: {
    lab_id: string
    lab_name: string
    vms: {
      session_id: string
      user_id: string
      status: LabSessionStatus
      phase?: string
      created_at: string
      usage: VMUsage | null // null until the controller has reported it
    }[]
    total: UsageTotal
  }[]
  total: UsageTotal
}

export interface ListLabSessionsParams {
  status?: LabSessionStatus
  lab_id?: string
}

// Every call goes through useApi(), so it carries the user's token and the configured API base.
// The trailing slash on collection routes matches how the API registers them.
export const useLabsApi = () => {
  const api = useApi()
  return {
    listLabs: (params: ListLabsParams = {}) =>
      api<ListLabsResponse>('/labs/', { query: params }),
    getLab: (labId: string) =>
      api<{ lab: Lab }>(`/labs/${labId}`),
    createLab: (body: CreateLabRequest) =>
      api<{ message: string, lab: Lab }>('/labs/', { method: 'POST', body }),
    updateLab: (labId: string, body: UpdateLabRequest) =>
      api<{ message: string, lab: Lab }>(`/labs/${labId}`, { method: 'PUT', body }),
    deleteLab: (labId: string) =>
      api<{ message: string }>(`/labs/${labId}`, { method: 'DELETE' }),
    getLabEstimate: (labId: string, persistence: Persistence = 'none') =>
      api<{ lab_id: string, estimate: LabEstimate }>(`/labs/${labId}/estimate`, { query: { persistence } }),

    listLabSessions: (params: ListLabSessionsParams = {}) =>
      api<{ sessions: LabSession[] }>('/lab-sessions/', { query: params }),
    getUsage: () =>
      api<UsageReport>('/lab-sessions/usage'),
    getLabSession: (sessionId: string) =>
      api<GetLabSessionResponse>(`/lab-sessions/${sessionId}`),
    createLabSession: (body: CreateLabSessionRequest) =>
      api<CreateLabSessionResponse>('/lab-sessions/', { method: 'POST', body }),
    deleteLabSession: (sessionId: string) =>
      api<{ message: string }>(`/lab-sessions/${sessionId}`, { method: 'DELETE' })
  }
}

export interface LabsState {
  labs: Lab[]
  sessions: LabSession[]
  currentSession: LabSession | null
  isLoading: boolean
  searchQuery: string
  selectedCategory: string
  selectedDifficulty: string
}

export const useLabsStore = defineStore('labs', {
  state: (): LabsState => ({
    labs: [],
    sessions: [],
    currentSession: null,
    isLoading: false,
    searchQuery: '',
    selectedCategory: 'all',
    selectedDifficulty: 'all'
  }),

  getters: {
    filteredLabs: (state) => {
      return state.labs.filter(lab => {
        const query = state.searchQuery.toLowerCase()
        const matchesSearch = !query ||
          lab.name.toLowerCase().includes(query) ||
          (lab.description ?? '').toLowerCase().includes(query) ||
          (lab.tags ?? []).some(tag => tag.toLowerCase().includes(query))

        const matchesCategory = state.selectedCategory === 'all' || lab.category === state.selectedCategory
        const matchesDifficulty = state.selectedDifficulty === 'all' || lab.difficulty_level === state.selectedDifficulty

        return matchesSearch && matchesCategory && matchesDifficulty && lab.is_published
      })
    },

    categories: (state) => {
      const categories = [...new Set(state.labs.map(lab => lab.category).filter((c): c is string => !!c))]
      return ['all', ...categories]
    },

    activeSessions: (state) => {
      return state.sessions.filter(session => session.status === 'pending' || session.status === 'running')
    }
  },

  actions: {
    async fetchLabs() {
      this.isLoading = true
      try {
        const { labs } = await useLabsApi().listLabs()
        this.labs = labs
      } catch (error) {
        console.error('Failed to fetch labs:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchSessions() {
      this.isLoading = true
      try {
        const { sessions } = await useLabsApi().listLabSessions()
        this.sessions = sessions
      } catch (error) {
        console.error('Failed to fetch sessions:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createSession(labId: string) {
      this.isLoading = true
      try {
        // The API starts the session and answers 202 before it's running
        const { session, credentials } = await useLabsApi().createLabSession({ lab_id: labId })
        // The API returns the password only here; the workspace page shows it
        useState(`vscode-password-${session.id}`).value = credentials.vscode_password

        this.sessions.push(session)
        this.currentSession = session
        return session
      } catch (error) {
        console.error('Failed to create session:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async stopSession(sessionId: string) {
      try {
        await useLabsApi().deleteLabSession(sessionId)

        const session = this.sessions.find(s => s.id === sessionId)
        if (session) {
          session.status = 'completed'
        }

        if (this.currentSession?.id === sessionId) {
          this.currentSession = null
        }
      } catch (error) {
        console.error('Failed to stop session:', error)
        throw error
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    setSelectedCategory(category: string) {
      this.selectedCategory = category
    },

    setSelectedDifficulty(difficulty: string) {
      this.selectedDifficulty = difficulty
    },

    clearFilters() {
      this.searchQuery = ''
      this.selectedCategory = 'all'
      this.selectedDifficulty = 'all'
    }
  }
})