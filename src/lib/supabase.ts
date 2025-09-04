import { createClient, type AuthTokenResponsePassword } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with JWT configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for better securitya
  },
})

export interface UserMetadata {
  first_name: string
}

// Types
export interface User {
  id: string
  email: string
  created_at: string
  user_metadata: unknown
}

export interface SignUpStep1Data {
  email: string
  password: string
}

export interface SignUpStep2Data {
  firstName: string
  lastName: string
  phone: string
}

export interface SignUpStep3Data {
  company: string
  position: string
  experience: string
}

export interface CompleteSignUpData extends SignUpStep2Data, SignUpStep3Data {
  userId: string
}
