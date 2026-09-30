import { defineStore } from 'pinia'

export interface Lab {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  tags: string[]
  imageUrl: string
  isActive: boolean
  prerequisites?: string[]
}

export interface LabSession {
  id: string
  labId: string
  userId: string
  status: 'starting' | 'running' | 'stopped' | 'error'
  createdAt: string
  updatedAt: string
  expiresAt: string
  connectionInfo?: {
    terminalUrl: string
    codeServerUrl: string
    fileServerUrl: string
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
        const matchesSearch = !state.searchQuery || 
          lab.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          lab.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          lab.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
        
        const matchesCategory = state.selectedCategory === 'all' || lab.category === state.selectedCategory
        const matchesDifficulty = state.selectedDifficulty === 'all' || lab.difficulty === state.selectedDifficulty
        
        return matchesSearch && matchesCategory && matchesDifficulty && lab.isActive
      })
    },

    categories: (state) => {
      const categories = [...new Set(state.labs.map(lab => lab.category))]
      return ['all', ...categories]
    },

    activeSessions: (state) => {
      return state.sessions.filter(session => ['starting', 'running'].includes(session.status))
    }
  },

  actions: {
    async fetchLabs() {
      this.isLoading = true
      try {
        const { labs } = await useApi()<{ labs: Lab[] }>('/labs/')
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
        const { sessions } = await useApi()<{ sessions: LabSession[] }>('/lab-sessions/')
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
        const { session, credentials } = await useApi()<{
          session: LabSession
          credentials: { vscode_password: string }
        }>('/lab-sessions/', {
          method: 'POST',
          body: { lab_id: labId }
        })
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
        await useApi()(`/lab-sessions/${sessionId}`, {
          method: 'DELETE'
        })
        
        const session = this.sessions.find(s => s.id === sessionId)
        if (session) {
          session.status = 'stopped'
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