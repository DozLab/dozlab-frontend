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
        // TODO: Implement actual API call
        const labs = await $fetch('/api/labs')
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
        // TODO: Implement actual API call
        const sessions = await $fetch('/api/sessions')
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
        // TODO: Implement actual API call
        const session = await $fetch('/api/sessions', {
          method: 'POST',
          body: { labId }
        })
        
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
        // TODO: Implement actual API call
        await $fetch(`/api/sessions/${sessionId}/stop`, {
          method: 'POST'
        })
        
        const sessionIndex = this.sessions.findIndex(s => s.id === sessionId)
        if (sessionIndex !== -1) {
          this.sessions[sessionIndex].status = 'stopped'
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