// Stripe Client Operations
import { getStripe, STRIPE_CONFIG, getStripeUrls, PLANS } from './config'
import type Stripe from 'stripe'

// Re-export getStripe for direct usage
export { getStripe }

// ============================================
// Customer Management
// ============================================

export async function createStripeCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  const customer = await getStripe().customers.create({
    email,
    name,
    metadata: {
      source: 'ats-cv-optimizer',
      ...metadata,
    },
  })

  return customer
}

export async function getStripeCustomer(
  customerId: string
): Promise<Stripe.Customer | null> {
  try {
    const customer = await getStripe().customers.retrieve(customerId)
    if (customer.deleted) {
      return null
    }
    return customer as Stripe.Customer
  } catch (error) {
    console.error('Error retrieving Stripe customer:', error)
    return null
  }
}

export async function updateStripeCustomer(
  customerId: string,
  data: Stripe.CustomerUpdateParams
): Promise<Stripe.Customer | null> {
  try {
    const customer = await getStripe().customers.update(customerId, data)
    return customer
  } catch (error) {
    console.error('Error updating Stripe customer:', error)
    return null
  }
}

// ============================================
// Checkout Sessions
// ============================================

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string,
  baseUrl: string
): Promise<Stripe.Checkout.Session> {
  const urls = getStripeUrls(baseUrl)

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: urls.success,
    cancel_url: urls.cancel,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
      trial_period_days: STRIPE_CONFIG.trialDays,
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  })

  return session
}

export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    })
    return session
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return null
  }
}

// ============================================
// Subscription Management
// ============================================

export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await getStripe().subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error retrieving subscription:', error)
    return null
  }
}

export async function getCustomerSubscriptions(
  customerId: string
): Promise<Stripe.Subscription[]> {
  try {
    const subscriptions = await getStripe().subscriptions.list({
      customer: customerId,
      status: 'all',
    })
    return subscriptions.data
  } catch (error) {
    console.error('Error retrieving customer subscriptions:', error)
    return []
  }
}

export async function cancelSubscription(
  subscriptionId: string,
  immediately = false
): Promise<Stripe.Subscription | null> {
  try {
    if (immediately) {
      return await getStripe().subscriptions.cancel(subscriptionId)
    } else {
      return await getStripe().subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      })
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return null
  }
}

export async function reactivateSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    return await getStripe().subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    return null
  }
}

export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await getStripe().subscriptions.retrieve(subscriptionId)
    const updatedSubscription = await getStripe().subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'create_prorations',
      }
    )
    return updatedSubscription
  } catch (error) {
    console.error('Error updating subscription:', error)
    return null
  }
}

// ============================================
// Billing Portal
// ============================================

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

// ============================================
// Invoice Management
// ============================================

export async function getCustomerInvoices(
  customerId: string,
  limit = 10
): Promise<Stripe.Invoice[]> {
  try {
    const invoices = await getStripe().invoices.list({
      customer: customerId,
      limit,
    })
    return invoices.data
  } catch (error) {
    console.error('Error retrieving customer invoices:', error)
    return []
  }
}

export async function getUpcomingInvoice(
  customerId: string
): Promise<Stripe.UpcomingInvoice | null> {
  try {
    const invoice = await getStripe().invoices.retrieveUpcoming({
      customer: customerId,
    })
    return invoice
  } catch (error) {
    // No upcoming invoice is normal for canceled subscriptions
    return null
  }
}

// ============================================
// Webhook Verification
// ============================================

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  return getStripe().webhooks.constructEvent(payload, signature, webhookSecret)
}

// ============================================
// Subscription Status Helpers
// ============================================

export function isSubscriptionActive(
  subscription: Stripe.Subscription
): boolean {
  return ['active', 'trialing'].includes(subscription.status)
}

export function getSubscriptionEndDate(
  subscription: Stripe.Subscription
): Date | null {
  if (subscription.cancel_at) {
    return new Date(subscription.cancel_at * 1000)
  }
  if (subscription.current_period_end) {
    return new Date(subscription.current_period_end * 1000)
  }
  return null
}

export function isInTrialPeriod(subscription: Stripe.Subscription): boolean {
  return subscription.status === 'trialing'
}

export function getTrialEndDate(
  subscription: Stripe.Subscription
): Date | null {
  if (subscription.trial_end) {
    return new Date(subscription.trial_end * 1000)
  }
  return null
}

// ============================================
// Price Helpers
// ============================================

export async function getPrice(priceId: string): Promise<Stripe.Price | null> {
  try {
    const price = await getStripe().prices.retrieve(priceId, {
      expand: ['product'],
    })
    return price
  } catch (error) {
    console.error('Error retrieving price:', error)
    return null
  }
}

export async function createPremiumPrice(): Promise<Stripe.Price> {
  // First, create or retrieve the product
  let product: Stripe.Product

  try {
    const existingProducts = await getStripe().products.list({
      active: true,
      limit: 1,
    })

    const premiumProduct = existingProducts.data.find(
      (p) => p.name === 'ATS CV Optimizer Premium'
    )

    if (premiumProduct) {
      product = premiumProduct
    } else {
      product = await getStripe().products.create({
        name: 'ATS CV Optimizer Premium',
        description: 'Unlimited CV conversions with advanced ATS optimization',
        metadata: {
          plan: 'premium',
        },
      })
    }
  } catch (error) {
    throw new Error('Failed to create/retrieve Stripe product')
  }

  // Create the price
  const price = await getStripe().prices.create({
    product: product.id,
    unit_amount: STRIPE_CONFIG.pricing.premiumMonthly,
    currency: STRIPE_CONFIG.pricing.currency,
    recurring: {
      interval: 'month',
    },
    metadata: {
      plan: 'premium',
    },
  })

  return price
}
