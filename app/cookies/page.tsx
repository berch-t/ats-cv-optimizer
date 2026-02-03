import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy for ATS CV Optimizer.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-12">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">What Are Cookies</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Cookies are small text files stored on your device when you visit a website.
                They help provide a better user experience by remembering your preferences
                and session information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Cookies We Use</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <h3 className="font-medium text-zinc-900 dark:text-white mb-1">Essential Cookies</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Required for authentication and basic functionality. These cannot be disabled
                    as they are necessary for the service to work properly.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <h3 className="font-medium text-zinc-900 dark:text-white mb-1">Preference Cookies</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Store your preferences such as theme (light/dark mode) and language settings.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <h3 className="font-medium text-zinc-900 dark:text-white mb-1">Firebase Authentication</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Firebase uses cookies and local storage to manage user authentication sessions securely.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Third-Party Cookies</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                We do not use third-party advertising or tracking cookies. Stripe may set cookies
                during the payment process for fraud prevention purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Managing Cookies</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                You can manage cookies through your browser settings. Disabling essential cookies
                may affect the functionality of the service, particularly authentication features.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
