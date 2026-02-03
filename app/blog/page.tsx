import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tips, guides, and insights on CV optimization and job searching.',
}

export default function BlogPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12">
            Tips, guides, and insights on CV optimization and ATS systems.
          </p>

          <div className="text-center py-16 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
            <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Coming Soon
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
              We&apos;re working on insightful articles about CV optimization,
              ATS best practices, and job search strategies.
            </p>
            <Link href="/convert">
              <Button>
                Try ATS Optimizer Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
