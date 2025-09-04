import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { apiService } from '@/services/api'
import type { User, SignUpStep1Data, CompleteSignUpData } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value && !!session.value)

  // Initialize auth state with proper JWT handling
  const initialize = async () => {
    try {
      isLoading.value = true

      // Get initial session
      const {
        data: { session: initialSession },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
        return
      }

      if (initialSession) {
        session.value = initialSession
        user.value = initialSession.user as User

        // Verify the JWT token is valid
        const { user: verifiedUser, error: verifyError } = await apiService.verifyToken()
        if (verifyError) {
          console.error('Token verification failed:', verifyError)
          await signOut()
          return
        }
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.email)

        session.value = newSession
        user.value = (newSession?.user as User) || null

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in successfully')
            break
          case 'SIGNED_OUT':
            console.log('User signed out')
            session.value = null
            user.value = null
            break
          case 'TOKEN_REFRESHED':
            console.log('JWT token refreshed')
            break
          case 'USER_UPDATED':
            console.log('User updated')
            break
          case 'PASSWORD_RECOVERY':
            console.log('Password recovery initiated')
            break
        }
      })
    } catch (err) {
      console.error('Auth initialization error:', err)
      error.value = 'Failed to initialize authentication'
    } finally {
      isLoading.value = false
    }
  }

  // Sign up - Step 1 (Create Supabase user with JWT)
  const signUpStep1 = async (data: SignUpStep1Data) => {
    isLoading.value = true
    error.value = null

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          // Customize JWT claims if needed
          data: {
            signup_step: 1,
            registration_source: 'web',
          },
        },
      })

      if (authError) {
        console.error('Signup error:', authError)
        throw authError
      }

      // Update local state
      if (authData.session) {
        session.value = authData.session
        user.value = authData.user as User
      }

      return {
        user: authData.user,
        session: authData.session,
        needsVerification: !authData.session, // If no session, email verification is needed
      }
    } catch (err: any) {
      console.error('Sign up step 1 error:', err)
      error.value = err.message || 'Failed to create account'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Complete signup (Send additional data to backend with JWT auth)
  const completeSignUp = async (data: CompleteSignUpData) => {
    isLoading.value = true
    error.value = null

    try {
      // Ensure we have a valid session
      if (!session.value?.access_token) {
        throw new Error('No valid session found')
      }

      const response = await apiService.completeUserProfile(data)

      // Update user metadata in Supabase if needed
      await supabase.auth.updateUser({
        data: {
          signup_completed: true,
          profile_completed_at: new Date().toISOString(),
        },
      })

      return response
    } catch (err: any) {
      console.error('Complete signup error:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to complete profile'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Sign in with proper JWT handling
  const signIn = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error('Sign in error:', authError)
        throw authError
      }

      // Update local state
      session.value = data.session
      user.value = data.user as User

      console.log(
        'Sign in successful, JWT expires at:',
        data.session?.expires_at ? new Date(data.session.expires_at * 1000) : 'unknown',
      )

      return data
    } catch (err: any) {
      console.error('Sign in failed:', err)
      error.value = err.message || 'Failed to sign in'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Sign out and clear JWT
  const signOut = async () => {
    try {
      isLoading.value = true

      const { error: authError } = await supabase.auth.signOut()
      if (authError) {
        console.error('Sign out error:', authError)
        throw authError
      }

      // Clear local state
      session.value = null
      user.value = null

      console.log('Successfully signed out')
    } catch (err: any) {
      console.error('Sign out failed:', err)
      error.value = err.message || 'Failed to sign out'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Refresh JWT token manually
  const refreshToken = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        throw error
      }

      if (data.session) {
        session.value = data.session
        user.value = data.user as User
        console.log('JWT token refreshed successfully')
        return data.session
      }

      return null
    } catch (err: any) {
      console.error('Token refresh failed:', err)
      error.value = 'Failed to refresh authentication'
      throw err
    }
  }

  // Get current JWT token
  const getToken = () => {
    return session.value?.access_token || null
  }

  // Check if token is expired or will expire soon
  const isTokenExpired = (bufferMinutes = 5) => {
    if (!session.value?.expires_at) return true

    const expiresAt = session.value.expires_at * 1000 // Convert to milliseconds
    const now = Date.now()
    const buffer = bufferMinutes * 60 * 1000 // Convert minutes to milliseconds

    return expiresAt - now < buffer
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user,
    session,
    isLoading,
    error,
    isAuthenticated,
    initialize,
    signUpStep1,
    completeSignUp,
    signIn,
    signOut,
    refreshToken,
    getToken,
    isTokenExpired,
    clearError,
  }
})
