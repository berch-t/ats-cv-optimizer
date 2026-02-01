'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Crown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthContext } from '@/components/providers'
import { PRICING_PLANS } from '@/lib/stripe/plans'
import { cn } from '@/lib/utils/cn'

export default function PricingPage() {
  const { isAuthenticated, isPremium } = useAuthContext()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=/pricing'
      return
    }

    setIsLoading(planId)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const plans = [
    {
      id: 'free',
      name: PRICING_PLANS.free.name,
      description: 'Perfect to get started',
      price: 0,
      interval: 'forever',
      features: PRICING_PLANS.free.features,
      cta: isPremium ? 'Current Plan' : 'Get Started',
      href: '/convert',
      popular: false,
    },
    {
      id: 'premium',
      name: PRICING_PLANS.premium.name,
      description: 'For serious job seekers',
      price: PRICING_PLANS.premium.price,
      interval: 'month',
      features: PRICING_PLANS.premium.features,
      cta: isPremium ? 'Current Plan' : 'Upgrade Now',
      onClick: () => handleUpgrade('premium'),
      popular: true,
    },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4">
              Simple Pricing
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
                Plan
              </span>
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Start free and upgrade when you need more. No hidden fees, cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    'relative h-full',
                    plan.popular &&
                      'border-sky-500 dark:border-sky-400 shadow-lg shadow-sky-500/10'
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white border-0">
                        <Crown className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      {plan.popular ? (
                        <Zap className="h-5 w-5 text-sky-500" />
                      ) : null}
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Price */}
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                          {plan.price === 0 ? 'Free' : `€${plan.price}`}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-zinc-500">/{plan.interval}</span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="pt-4">
                      {plan.href ? (
                        <Link href={plan.href} className="block">
                          <Button
                            variant={plan.popular ? 'default' : 'outline'}
                            className={cn(
                              'w-full',
                              plan.popular &&
                                'bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600'
                            )}
                          >
                            {plan.cta}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant={plan.popular ? 'default' : 'outline'}
                          className={cn(
                            'w-full',
                            plan.popular &&
                              'bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600'
                          )}
                          onClick={plan.onClick}
                          disabled={isPremium || isLoading === plan.id}
                        >
                          {isLoading === plan.id ? 'Loading...' : plan.cta}
                          {!isPremium && <ArrowRight className="h-4 w-4 ml-2" />}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-zinc-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your Premium subscription at any time. You will continue to have access until the end of your billing period.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.',
              },
              {
                q: 'Is my CV data secure?',
                a: 'Absolutely. We use industry-standard encryption and never share your data with third parties. Your CVs are automatically deleted after 30 days.',
              },
              {
                q: 'What happens when I reach my free conversion limit?',
                a: 'You can upgrade to Premium for unlimited conversions, or wait until your monthly limit resets at the beginning of each month.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            Ready to land more interviews?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Start optimizing your CV today and get past the ATS filters.
          </p>
          <Link href="/convert">
            <Button
              size="lg"
              className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
            >
              Try It Free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
