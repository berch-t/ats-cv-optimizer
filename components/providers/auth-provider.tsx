'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { User } from 'firebase/auth'
import { useAuth } from '@/lib/hooks/use-auth'
import type { UserSubscription } from '@/types/user'

export interface AuthContextValue {
  user: User | null
  subscription: UserSubscription | null
  loading: boolean
  isLoading: boolean // Alias for loading
  error: string | null
  isAuthenticated: boolean
  isPremium: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>
  signInGoogle: () => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  refreshSubscription: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  // Add isLoading as an alias for loading
  const value: AuthContextValue = {
    ...auth,
    isLoading: auth.loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
