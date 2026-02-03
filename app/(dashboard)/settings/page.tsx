'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  CreditCard,
  Bell,
  Globe,
  Shield,
  Trash2,
  Crown,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuthContext } from '@/components/providers'
import { getAuth } from 'firebase/auth'

export default function SettingsPage() {
  const { user, isPremium, subscription, signOut } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    language: 'en',
    notifications: true,
    targetSector: '',
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // In production, call API to update user settings
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user', { method: 'DELETE' })
      if (response.ok) {
        signOut()
      }
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const currentUser = getAuth().currentUser
      if (!currentUser) return
      const idToken = await currentUser.getIdToken()
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}` },
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-semibold">
                {user?.email?.[0].toUpperCase() || 'U'}
              </div>
              <div>
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscription Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>Manage your subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    isPremium
                      ? 'bg-gradient-to-br from-sky-500 to-emerald-500'
                      : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                >
                  <Crown
                    className={`h-6 w-6 ${isPremium ? 'text-white' : 'text-zinc-500'}`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-900 dark:text-white">
                      {isPremium ? 'Premium Plan' : 'Free Plan'}
                    </h3>
                    <Badge variant={isPremium ? 'default' : 'secondary'}>
                      {isPremium ? 'Active' : 'Current'}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-500">
                    {isPremium
                      ? 'Unlimited conversions, all features included'
                      : `${subscription?.conversionsUsed || 0}/${
                          subscription?.conversionsLimit || 3
                        } conversions used this month`}
                  </p>
                </div>
              </div>

              {isPremium ? (
                <Button variant="outline" onClick={handleManageSubscription}>
                  Manage Subscription
                </Button>
              ) : (
                <Button
                  className="bg-gradient-to-r from-sky-500 to-emerald-500"
                  asChild
                >
                  <a href="/pricing">Upgrade</a>
                </Button>
              )}
            </div>

            {isPremium && subscription?.periodEnd && (
              <p className="text-sm text-zinc-500 mt-4">
                Your subscription renews on{' '}
                {new Date(subscription.periodEnd).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferences
            </CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData({ ...formData, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Francais</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="es">Espanol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetSector">Default Target Sector</Label>
                <Select
                  value={formData.targetSector}
                  onValueChange={(value) =>
                    setFormData({ ...formData, targetSector: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-zinc-500" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    Password
                  </p>
                  <p className="text-sm text-zinc-500">
                    Change your password
                  </p>
                </div>
              </div>
              <Button variant="outline">Change Password</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-zinc-500" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    Email Notifications
                  </p>
                  <p className="text-sm text-zinc-500">
                    Receive updates about your conversions
                  </p>
                </div>
              </div>
              <Button variant="outline">
                {formData.notifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">
                  Delete Account
                </p>
                <p className="text-sm text-zinc-500">
                  Permanently delete your account and all data
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Yes, delete my account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        {isSaved && (
          <span className="flex items-center gap-2 text-emerald-600">
            <Check className="h-4 w-4" />
            Settings saved
          </span>
        )}
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
