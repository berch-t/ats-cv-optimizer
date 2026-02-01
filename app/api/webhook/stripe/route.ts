import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe/config'
import { adminDb } from '@/lib/firebase/admin'

export async function POST(request: NextRequest) {
  // Check Firebase Admin is initialized
  if (!adminDb) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id

        if (!userId) {
          console.error('No user ID in checkout session')
          break
        }

        // Get subscription details
        const subscriptionId = session.subscription as string
        const subscription = await getStripe().subscriptions.retrieve(subscriptionId)

        // Update user subscription in Firestore
        await adminDb.collection('subscriptions').doc(userId).set({
          userId,
          plan: 'premium',
          conversionsUsed: 0,
          conversionsLimit: -1, // Unlimited
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscriptionId,
          periodStart: new Date(subscription.current_period_start * 1000),
          periodEnd: new Date(subscription.current_period_end * 1000),
          status: 'active',
          updatedAt: new Date(),
        }, { merge: true })

        console.log(`User ${userId} upgraded to premium`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Find user by Stripe customer ID
        const snapshot = await adminDb
          .collection('subscriptions')
          .where('stripeCustomerId', '==', subscription.customer)
          .limit(1)
          .get()

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          await doc.ref.update({
            periodEnd: new Date(subscription.current_period_end * 1000),
            status: subscription.status,
            updatedAt: new Date(),
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Find user by Stripe customer ID
        const snapshot = await adminDb
          .collection('subscriptions')
          .where('stripeCustomerId', '==', subscription.customer)
          .limit(1)
          .get()

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          // Downgrade to free plan
          await doc.ref.update({
            plan: 'free',
            conversionsLimit: 3,
            status: 'canceled',
            updatedAt: new Date(),
          })
          console.log(`User ${doc.id} downgraded to free plan`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        // Find user and mark payment as failed
        const snapshot = await adminDb
          .collection('subscriptions')
          .where('stripeCustomerId', '==', invoice.customer)
          .limit(1)
          .get()

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          await doc.ref.update({
            status: 'payment_failed',
            updatedAt: new Date(),
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
