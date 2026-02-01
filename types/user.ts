// User and Subscription Types

export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  emailVerified: boolean
  createdAt: Date
  lastLoginAt: Date
  provider: AuthProvider
  settings: UserSettings
}

export type AuthProvider = 'email' | 'google' | 'github'

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'fr' | 'es' | 'de'
  notifications: NotificationSettings
  defaultSector?: string
  timezone?: string
}

export interface NotificationSettings {
  email: boolean
  marketing: boolean
  productUpdates: boolean
  weeklyDigest: boolean
}

// Subscription Types
export type SubscriptionPlan = 'free' | 'premium' | 'enterprise'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused'

export interface UserSubscription {
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  conversionsUsed: number
  conversionsLimit: number // -1 for unlimited
  periodStart: Date
  periodEnd: Date
  cancelAtPeriodEnd: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  trialEnd?: Date
  createdAt: Date
  updatedAt: Date
}

export interface PlanDetails {
  id: SubscriptionPlan
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  conversionsPerMonth: number // -1 for unlimited
  features: PlanFeature[]
  stripePriceId?: string
  popular?: boolean
}

export interface PlanFeature {
  name: string
  included: boolean
  description?: string
  limit?: number | 'unlimited'
}

// Usage tracking
export interface UsageRecord {
  userId: string
  type: UsageType
  timestamp: Date
  metadata?: Record<string, unknown>
}

export type UsageType =
  | 'conversion'
  | 'export'
  | 'analysis'
  | 'job_match'
  | 'template_use'

export interface UsageStats {
  userId: string
  period: 'day' | 'week' | 'month'
  periodStart: Date
  periodEnd: Date
  conversions: number
  exports: number
  analyses: number
  jobMatches: number
}

// Conversion History
export interface ConversionHistoryItem {
  id: string
  userId: string
  originalFileName: string
  originalFileSize: number
  originalUrl: string
  optimizedUrl: string
  targetSector?: string
  targetJobTitle?: string
  originalScore: number
  optimizedScore: number
  scoreImprovement: number
  createdAt: Date
  expiresAt?: Date // URL expiration
}

// User Profile for Dashboard
export interface UserProfile {
  user: User
  subscription: UserSubscription
  stats: UserStats
  recentConversions: ConversionHistoryItem[]
}

export interface UserStats {
  totalConversions: number
  averageScoreImprovement: number
  mostUsedSector: string
  conversionsThisMonth: number
  memberSince: Date
}

// Session Types
export interface AuthSession {
  user: User
  accessToken: string
  refreshToken?: string
  expiresAt: Date
}

// Billing Types
export interface BillingInfo {
  name: string
  email: string
  address?: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
}

export interface Invoice {
  id: string
  stripeInvoiceId: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  invoiceUrl?: string
  pdfUrl?: string
  createdAt: Date
  paidAt?: Date
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'sepa_debit' | 'paypal'
  card?: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }
  isDefault: boolean
}
