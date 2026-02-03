import type { Metadata } from 'next'
import { Mail, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the ATS CV Optimizer team.',
}

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12">
            Have a question or need help? We&apos;d love to hear from you.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <Mail className="h-8 w-8 text-sky-500 mb-4" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Email Support
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                For general inquiries and support requests.
              </p>
              <a
                href="mailto:support@ats-cv-optimizer.com"
                className="text-sky-500 hover:text-sky-600 font-medium text-sm"
              >
                support@ats-cv-optimizer.com
              </a>
            </div>

            <div className="p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <MessageSquare className="h-8 w-8 text-emerald-500 mb-4" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Feedback
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Help us improve by sharing your experience and suggestions.
              </p>
              <a
                href="mailto:feedback@ats-cv-optimizer.com"
                className="text-emerald-500 hover:text-emerald-600 font-medium text-sm"
              >
                feedback@ats-cv-optimizer.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
