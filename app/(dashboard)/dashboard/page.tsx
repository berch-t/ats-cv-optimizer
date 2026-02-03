'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Award,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useAuthContext } from '@/components/providers'
import { getUserConversions } from '@/lib/firebase/firestore'
import type { ConversionHistoryItem } from '@/types/user'

export default function DashboardPage() {
  const { user, isPremium, subscription } = useAuthContext()
  const [recentConversions, setRecentConversions] = useState<ConversionHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalConversions: 0,
    averageScore: 0,
    bestScore: 0,
    scoreImprovement: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }
      try {
        const conversions = await getUserConversions(user.uid, 50)
        setRecentConversions(conversions)

        const scores = conversions.map((c) => c.optimizedScore).filter((s) => s > 0)
        const improvements = conversions.map((c) => c.scoreImprovement).filter((s) => s > 0)

        setStats({
          totalConversions: conversions.length,
          averageScore: scores.length > 0
            ? Math.round(scores.reduce((a, s) => a + s, 0) / scores.length)
            : 0,
          bestScore: scores.length > 0 ? Math.max(...scores) : 0,
          scoreImprovement: improvements.length > 0
            ? Math.round(improvements.reduce((a, s) => a + s, 0) / improvements.length)
            : 0,
        })
      } catch (error) {
        console.error('Error fetching conversions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const usagePercentage = subscription
    ? subscription.conversionsLimit === -1
      ? 0
      : (subscription.conversionsUsed / subscription.conversionsLimit) * 100
    : 0

  const remainingConversions = subscription
    ? subscription.conversionsLimit === -1
      ? 'Unlimited'
      : `${subscription.conversionsLimit - subscription.conversionsUsed} remaining`
    : '3 remaining'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'there'}!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Here&apos;s an overview of your CV optimization journey.
          </p>
        </div>
        <Link href="/convert">
          <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600">
            <Zap className="h-4 w-4 mr-2" />
            New Conversion
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-sky-100 dark:bg-sky-900/30">
                  <FileText className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Total Conversions
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {stats.totalConversions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Average Score
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {stats.averageScore}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Best Score
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {stats.bestScore}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                  <TrendingUp className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Avg. Improvement
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    +{stats.scoreImprovement}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Usage & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Usage Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Usage</CardTitle>
            <CardDescription>
              Your conversion usage for this billing period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {remainingConversions}
                  </span>
                </div>
                <Badge variant={isPremium ? 'default' : 'secondary'}>
                  {isPremium ? 'Premium' : 'Free'}
                </Badge>
              </div>

              {!isPremium && (
                <>
                  <Progress value={usagePercentage} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">
                      {subscription?.conversionsUsed || 0} /{' '}
                      {subscription?.conversionsLimit || 3} conversions used
                    </span>
                    <Link href="/pricing">
                      <Button variant="link" className="p-0 h-auto text-sky-600">
                        Upgrade for unlimited
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </>
              )}

              {isPremium && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Unlimited conversions active</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/convert" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Upload New CV
              </Button>
            </Link>
            <Link href="/history" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Clock className="h-4 w-4" />
                View History
              </Button>
            </Link>
            <Link href="/settings" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Target className="h-4 w-4" />
                Target Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Conversions</CardTitle>
            <CardDescription>Your latest CV optimizations</CardDescription>
          </div>
          <Link href="/history">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : recentConversions.length > 0 ? (
            <div className="space-y-4">
              {recentConversions.slice(0, 5).map((conversion) => (
                <div
                  key={conversion.id}
                  className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30">
                      <FileText className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {conversion.originalFileName || 'CV Document'}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {new Date(conversion.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">
                        {conversion.optimizedScore || 0}%
                      </p>
                      <p className="text-xs text-zinc-500">ATS Score</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/history?id=${conversion.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
              <h3 className="font-medium text-zinc-900 dark:text-white mb-2">
                No conversions yet
              </h3>
              <p className="text-sm text-zinc-500 mb-4">
                Upload your first CV to get started
              </p>
              <Link href="/convert">
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  Upload CV
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
