import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for ATS CV Optimizer.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-12">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">1. Information We Collect</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                We collect information you provide when creating an account (email address, display name)
                and CV documents you upload for optimization. We also collect usage data such as
                conversion history and ATS scores.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">2. How We Use Your Information</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Your information is used to provide CV optimization services, maintain your account,
                process payments, and improve our platform. CV content is processed by AI for analysis
                purposes only and is not used for model training.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">3. Data Storage and Security</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Your data is stored securely using Firebase (Google Cloud) with encryption at rest
                and in transit. Uploaded CVs are automatically deleted after 30 days. We use
                industry-standard security measures to protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">4. Third-Party Services</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                We use the following third-party services: Firebase (authentication and storage),
                Stripe (payment processing), and Anthropic Claude (AI analysis). Each service has
                its own privacy policy governing data handling.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">5. Your Rights</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                You have the right to access, modify, or delete your personal data at any time.
                You can manage your account settings or contact us to request data deletion.
                Under GDPR, you also have the right to data portability and to object to processing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">6. Cookies</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                We use essential cookies for authentication and session management. We do not use
                third-party tracking cookies. See our{' '}
                <a href="/cookies" className="text-sky-500 hover:text-sky-600">Cookie Policy</a>{' '}
                for more details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">7. Contact</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                For privacy-related inquiries, contact us at{' '}
                <a href="mailto:privacy@ats-cv-optimizer.com" className="text-sky-500 hover:text-sky-600">
                  privacy@ats-cv-optimizer.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
