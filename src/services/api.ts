import axios from 'axios'
import { supabase } from '@/lib/supabase'
import type { CompleteSignUpData } from '@/lib/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests with proper JWT handling
apiClient.interceptors.request.use(async (config) => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting session:', error)
      return config
    }

    if (session?.access_token) {
      // Set the Authorization header with the JWT access token
      config.headers.Authorization = `Bearer ${session.access_token}`

      // Optional: Add custom headers for additional context
      config.headers['X-Supabase-Auth'] = 'true'

      // Check if token needs refresh
      const expiresAt = session.expires_at
      const now = Math.floor(Date.now() / 1000)

      // Refresh token if it expires in the next 5 minutes
      if (expiresAt && expiresAt - now < 300) {
        const {
          data: { session: refreshedSession },
          error: refreshError,
        } = await supabase.auth.refreshSession()

        if (refreshError) {
          console.error('Error refreshing session:', refreshError)
        } else if (refreshedSession?.access_token) {
          config.headers.Authorization = `Bearer ${refreshedSession.access_token}`
        }
      }
    }
  } catch (error) {
    console.error('Error in request interceptor:', error)
  }

  return config
})

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, try to refresh
      try {
        const {
          data: { session },
          error: refreshError,
        } = await supabase.auth.refreshSession()

        if (refreshError || !session) {
          // Refresh failed, redirect to login
          await supabase.auth.signOut()
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Retry the original request with new token
        error.config.headers.Authorization = `Bearer ${session.access_token}`
        return apiClient.request(error.config)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        await supabase.auth.signOut()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export const apiService = {
  // Complete user profile after Supabase user creation
  async completeUserProfile(data: CompleteSignUpData) {
    const response = await apiClient.post('/users/complete-profile', data)
    return response.data
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
  },

  // Update user profile
  async updateUserProfile(userId: string, data: Partial<CompleteSignUpData>) {
    const response = await apiClient.put(`/users/${userId}`, data)
    return response.data
  },

  // Verify JWT token (optional utility)
  async verifyToken() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      return { user: null, error }
    }
  },
}
