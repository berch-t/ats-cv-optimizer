'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  History,
  Settings,
  CreditCard,
  FileText,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/components/providers'
import { cn } from '@/lib/utils/cn'

const sidebarLinks = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'History',
    href: '/history',
    icon: History,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, user, signOut } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(pathname))
    }
  }, [isAuthenticated, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 top-16 z-30">
          <div className="flex flex-col flex-1 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 pt-5 pb-4">
            {/* User info */}
            <div className="px-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-3',
                        isActive &&
                          'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Button>
                  </Link>
                )
              })}

              <div className="pt-4">
                <Link href="/convert">
                  <Button
                    className="w-full justify-start gap-3 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
                  >
                    <FileText className="h-5 w-5" />
                    New Conversion
                  </Button>
                </Link>
              </div>
            </nav>

            {/* Bottom actions */}
            <div className="px-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
              <Link href="/pricing">
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <CreditCard className="h-5 w-5" />
                  Upgrade Plan
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <nav className="flex justify-around p-2">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'flex-col gap-1 h-auto py-2',
                      isActive && 'text-sky-600 dark:text-sky-400'
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="text-xs">{link.label}</span>
                  </Button>
                </Link>
              )
            })}
            <Link href="/convert">
              <Button
                variant="ghost"
                size="sm"
                className="flex-col gap-1 h-auto py-2 text-sky-600"
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs">Convert</span>
              </Button>
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 lg:pl-64 pb-16 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
