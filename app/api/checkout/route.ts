import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, createStripeCustomer } from '@/lib/stripe/client'
import { PRICING_PLANS, STRIPE_CONFIG } from '@/lib/stripe/config'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Check Firebase Admin is initialized
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Get session token
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify session
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true)
    const userId = decodedToken.uid
    const userEmail = decodedToken.email

    // Get request body
    const { plan } = await request.json()

    if (plan !== 'premium') {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const subscriptionDoc = await adminDb.collection('subscriptions').doc(userId).get()
    let stripeCustomerId = subscriptionDoc.data()?.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await createStripeCustomer(
        userEmail || '',
        undefined,
        { userId }
      )
      stripeCustomerId = customer.id

      // Save customer ID to Firestore
      await adminDb.collection('subscriptions').doc(userId).set(
        { stripeCustomerId },
        { merge: true }
      )
    }

    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const priceId = STRIPE_CONFIG.prices.premiumMonthly || PRICING_PLANS.premium.priceId

    if (!priceId) {
      return NextResponse.json(
        { error: 'Premium plan not configured. Please set STRIPE_PREMIUM_PRICE_ID.' },
        { status: 500 }
      )
    }

    const session = await createCheckoutSession(
      stripeCustomerId,
      priceId,
      userId,
      baseUrl
    )

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
