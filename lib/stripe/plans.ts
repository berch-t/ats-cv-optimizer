// Client-safe Stripe plans configuration
// This file can be safely imported on both client and server

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
    features: PLANS.premium.features,
  },
}

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
