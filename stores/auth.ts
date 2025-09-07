import { defineStore } from 'pinia'

export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'tutor' | 'student'
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
    isTutor: (state) => state.user?.role === 'tutor',
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
        // TODO: Implement actual API call
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true
        
        // Store token in cookie for persistence
        const tokenCookie = useCookie('auth-token')
        tokenCookie.value = response.token
        
        return response
      } catch (error) {
        throw error
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
        // TODO: Implement actual API call
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData
        })
        
        return response
      } catch (error) {
        throw error
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
        // TODO: Implement actual API call
        const user = await $fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        
        this.user = user
        this.isAuthenticated = true
      } catch (error) {
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