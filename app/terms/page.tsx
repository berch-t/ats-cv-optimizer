import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for ATS CV Optimizer.',
}

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-12">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                By accessing and using ATS CV Optimizer, you agree to be bound by these Terms of Service.
                If you do not agree, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">2. Service Description</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                ATS CV Optimizer provides AI-powered CV analysis and optimization for Applicant Tracking
                Systems. We offer a free tier with limited conversions and a premium subscription with
                unlimited access.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">3. User Accounts</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                You are responsible for maintaining the security of your account credentials.
                You must provide accurate information when creating an account. We reserve the right
                to suspend accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">4. Subscription and Payments</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Premium subscriptions are billed monthly. You can cancel at any time and will retain
                access until the end of your billing period. Refunds are handled on a case-by-case basis.
                All payments are processed securely through Stripe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">5. Acceptable Use</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                You agree to use the service only for lawful purposes. You may not upload malicious
                content, attempt to exploit the system, or use the service to generate fraudulent
                documents. We reserve the right to terminate accounts that abuse the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">6. Intellectual Property</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                You retain ownership of all CV content you upload. We do not claim any rights to
                your documents. The optimized versions generated are yours to use freely.
                Our platform, branding, and technology remain our intellectual property.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">7. Limitation of Liability</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                ATS CV Optimizer provides optimization suggestions and analysis. We do not guarantee
                employment outcomes. The service is provided &quot;as is&quot; without warranties of any kind.
                Our liability is limited to the amount you paid for the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">8. Changes to Terms</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                We may update these terms from time to time. Continued use of the service after
                changes constitutes acceptance of the new terms. We will notify users of significant
                changes via email.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
