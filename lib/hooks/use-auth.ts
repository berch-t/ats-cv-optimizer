'use client'

import { useEffect, useState, useCallback } from 'react'
import { User } from 'firebase/auth'
import {
  onAuthStateChange,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut as firebaseSignOut,
  resetPassword as firebaseResetPassword,
} from '@/lib/firebase/auth'
import { getUserSubscription } from '@/lib/firebase/firestore'
import type { UserSubscription } from '@/types/user'

interface AuthState {
  user: User | null
  subscription: UserSubscription | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    subscription: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        // Fetch subscription data when user is authenticated
        try {
          const subscription = await getUserSubscription(user.uid)
          setState({
            user,
            subscription,
            loading: false,
            error: null,
          })
        } catch (err) {
          setState({
            user,
            subscription: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load subscription',
          })
        }
      } else {
        setState({
          user: null,
          subscription: null,
          loading: false,
          error: null,
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await signInWithEmail(email, password)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed'
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        await signUpWithEmail(email, password, name)
        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Sign up failed'
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
        return { success: false, error: errorMessage }
      }
    },
    []
  )

  const signInGoogle = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await signInWithGoogle()
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign in failed'
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [])

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await firebaseSignOut()
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed'
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    try {
      await firebaseResetPassword(email)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed'
      return { success: false, error: errorMessage }
    }
  }, [])

  const refreshSubscription = useCallback(async () => {
    if (state.user) {
      try {
        const subscription = await getUserSubscription(state.user.uid)
        setState((prev) => ({ ...prev, subscription }))
      } catch (err) {
        console.error('Failed to refresh subscription:', err)
      }
    }
  }, [state.user])

  return {
    user: state.user,
    subscription: state.subscription,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    isPremium: state.subscription?.plan === 'premium',
    signIn,
    signUp,
    signInGoogle,
    signOut,
    resetPassword,
    refreshSubscription,
  }
}
