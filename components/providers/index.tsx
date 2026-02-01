'use client'

import type { ReactNode } from 'react'
import { AuthProvider } from './auth-provider'
import { ThemeProvider } from './theme-provider'
import { ToastProvider } from './toast-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

// Re-export individual providers and hooks
export { AuthProvider, useAuthContext } from './auth-provider'
export { ThemeProvider, useTheme } from './theme-provider'
export { ToastProvider, useToast } from './toast-provider'
