// Stripe Configuration
import Stripe from 'stripe'

// Initialize Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

// ============================================
// Stripe Configuration Constants
// ============================================

export const STRIPE_CONFIG = {
  // Product and Price IDs (to be created in Stripe Dashboard)
  products: {
    premium: process.env.STRIPE_PREMIUM_PRODUCT_ID || '',
  },
  prices: {
    premiumMonthly: process.env.STRIPE_PREMIUM_PRICE_ID || '',
  },

  // Pricing
  pricing: {
    premiumMonthly: 999, // €9.99 in cents
    currency: 'eur',
  },

  // Trial period
  trialDays: 7,

  // Webhook events to handle
  webhookEvents: [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.paid',
    'invoice.payment_failed',
  ] as const,
}

// ============================================
// Plan Configuration
// ============================================

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out the service',
    price: 0,
    currency: 'EUR',
    interval: 'month' as const,
    features: [
      '3 CV conversions per month',
      'Basic ATS optimization',
      'PDF export',
      'Email support',
    ],
    limits: {
      conversionsPerMonth: 3,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      supportLevel: 'email',
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'Unlimited conversions for serious job seekers',
    price: 9.99,
    currency: 'EUR',
    interval: 'month' as const,
    features: [
      'Unlimited CV conversions',
      'Advanced ATS optimization',
      'All export formats (PDF, DOCX, TXT)',
      'Priority support',
      'Conversion history',
      'Custom templates',
      'Industry-specific keywords',
    ],
    limits: {
      conversionsPerMonth: -1, // Unlimited
      maxFileSize: 10 * 1024 * 1024, // 10MB
      supportLevel: 'priority',
    },
  },
} as const

export type PlanId = keyof typeof PLANS

// Alias for backwards compatibility with pricing page
export const PRICING_PLANS = {
  free: {
    name: PLANS.free.name,
    price: PLANS.free.price,
    features: PLANS.free.features,
  },
  premium: {
    name: PLANS.premium.name,
    price: PLANS.premium.price,
    priceId: STRIPE_CONFIG.prices.premiumMonthly,
    features: PLANS.premium.features,
  },
}

// ============================================
// Stripe URLs
// ============================================

export function getStripeUrls(baseUrl: string) {
  return {
    success: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
    cancel: `${baseUrl}/pricing?canceled=true`,
    billingPortal: `${baseUrl}/dashboard/settings`,
  }
}

// ============================================
// Helper Functions
// ============================================

export function getPlanById(planId: string) {
  return PLANS[planId as PlanId] || PLANS.free
}

export function isPremiumPlan(planId: string): boolean {
  return planId === 'premium'
}

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}
