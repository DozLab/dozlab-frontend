import { defineStore } from 'pinia'

export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'instructor' | 'student'
  firstName?: string
  lastName?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isInstructor: (state) => state.user?.role === 'instructor',
    // Instructors and admins create VMs and see what they use (the API's sessions:usage and
    // labs:estimate permissions)
    canManageVMs: (state) => state.user?.role === 'admin' || state.user?.role === 'instructor',
    isStudent: (state) => state.user?.role === 'student',
    fullName: (state) => {
      if (state.user?.firstName && state.user?.lastName) {
        return `${state.user.firstName} ${state.user.lastName}`
      }
      return state.user?.username || ''
    }
  },

  actions: {
    async login(credentials: { username: string; password: string }) {
      this.isLoading = true
      try {
        const response = await useApi()<{ user: User, tokens: { access_token: string } }>('/auth/login', {
          method: 'POST',
          body: credentials
        })

        this.token = response.tokens.access_token
        this.user = response.user
        this.isAuthenticated = true

        // Store token in cookie for persistence
        const tokenCookie = useCookie('auth-token')
        tokenCookie.value = this.token
        
        return response
      } finally {
        this.isLoading = false
      }
    },

    async register(userData: {
      username: string
      email: string
      password: string
      firstName?: string
      lastName?: string
    }) {
      this.isLoading = true
      try {
        const response = await useApi()('/auth/register', {
          method: 'POST',
          body: userData
        })
        
        return response
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      // Clear token cookie
      const tokenCookie = useCookie('auth-token')
      tokenCookie.value = null
      
      // Navigate to login page
      await navigateTo('/login')
    },

    async fetchUser() {
      if (!this.token) return
      
      try {
        const { user } = await useApi()<{ user: User }>('/users/profile')

        this.user = user
        this.isAuthenticated = true
      } catch {
        // Token might be invalid, logout
        await this.logout()
      }
    },

    async initializeAuth() {
      const tokenCookie = useCookie('auth-token')
      if (tokenCookie.value) {
        this.token = tokenCookie.value
        await this.fetchUser()
      }
    }
  }
})