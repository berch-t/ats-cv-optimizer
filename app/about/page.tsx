import type { Metadata } from 'next'
import { FileText, Target, Zap, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about ATS CV Optimizer and our mission to help job seekers land more interviews.',
}

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
              ATS CV Optimizer
            </span>
          </h1>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
              ATS CV Optimizer is an AI-powered platform that helps job seekers optimize their CVs
              for Applicant Tracking Systems. We analyze your CV against industry standards and
              provide actionable recommendations to increase your chances of landing interviews.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 my-12">
              {[
                {
                  icon: Target,
                  title: 'ATS-Optimized',
                  description: 'Our scoring engine is calibrated against the top 5 ATS platforms used by 98% of Fortune 500 companies.',
                },
                {
                  icon: Zap,
                  title: 'AI-Powered Analysis',
                  description: 'Using advanced AI, we provide detailed feedback on formatting, keywords, structure, and readability.',
                },
                {
                  icon: FileText,
                  title: 'Instant Results',
                  description: 'Upload your CV and receive a comprehensive analysis with an optimized version in seconds.',
                },
                {
                  icon: Shield,
                  title: 'Privacy First',
                  description: 'Your data is encrypted and never shared. CVs are automatically deleted after 30 days.',
                },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <item.icon className="h-8 w-8 text-sky-500 mb-3" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-12 mb-4">Our Mission</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Over 75% of CVs are rejected by ATS before a human ever reads them. Our mission is to
              level the playing field by giving every job seeker the tools to get past automated
              screening and into the hands of recruiters.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
