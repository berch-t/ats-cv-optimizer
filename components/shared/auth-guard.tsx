'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuthContext } from '@/components/providers'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requirePremium?: boolean
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = true,
  requirePremium = false,
  redirectTo = '/login',
}: AuthGuardProps) {
  const router = useRouter()
  const { user, loading, isPremium } = useAuthContext()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`)
      } else if (requirePremium && !isPremium) {
        router.push('/pricing?upgrade=true')
      }
    }
  }, [user, loading, requireAuth, requirePremium, isPremium, router, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null
  }

  if (requirePremium && !isPremium) {
    return null
  }

  return <>{children}</>
}

// Higher-order component version
export function withAuthGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<AuthGuardProps, 'children'> = {}
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <WrappedComponent {...props} />
      </AuthGuard>
    )
  }
}
