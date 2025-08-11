import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('auth_user')) || null,
    token: localStorage.getItem('auth_token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/login', credentials)
        
        if (response.data.success) {
          const { user, token } = response.data
          
          this.user = user
          this.token = token

          // Store in localStorage
          localStorage.setItem('auth_user', JSON.stringify(user))
          localStorage.setItem('auth_token', token)

          return { success: true }
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Login failed'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/register', userData)
        
        if (response.data.success) {
          const { user, token } = response.data
          
          this.user = user
          this.token = token

          localStorage.setItem('auth_user', JSON.stringify(user))
          localStorage.setItem('auth_token', token)

          return { success: true }
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Registration failed'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        if (this.token) {
          await api.post('/auth/logout')
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.error = null
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
      }
    },

    async fetchUser() {
      if (!this.token) return

      try {
        const response = await api.get('/auth/me')
        if (response.data.success) {
          this.user = response.data.user
          localStorage.setItem('auth_user', JSON.stringify(this.user))
        }
      } catch (error) {
        console.error('Fetch user error:', error)
        this.logout()
      }
    },

    clearError() {
      this.error = null
    }
  }
})