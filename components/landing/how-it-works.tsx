'use client'

import { motion } from 'framer-motion'
import { Upload, Cpu, Download, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Upload Your CV',
    description:
      'Simply drag and drop your PDF resume or click to upload. We support files up to 5MB.',
    color: 'from-sky-500 to-blue-600',
  },
  {
    icon: Cpu,
    title: 'AI Analysis',
    description:
      'Our Claude AI scans your CV for ATS compatibility issues, keyword gaps, and formatting problems.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: CheckCircle2,
    title: 'Get Recommendations',
    description:
      'Receive detailed suggestions for improving your CV with real-time chat feedback.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Download,
    title: 'Download Optimized CV',
    description:
      'Download your ATS-optimized CV in your preferred format and start applying.',
    color: 'from-amber-500 to-orange-600',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-32 bg-zinc-50 dark:bg-zinc-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Four Simple Steps to{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              Success
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Transform your CV from ATS-blocked to interview-ready in under a
            minute.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-16 relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 via-purple-500 via-emerald-500 to-amber-500 opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${step.color} shadow-lg`}
                  >
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-4xl font-bold text-zinc-200 dark:text-zinc-800">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="pl-0 lg:pl-0">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Mobile/Tablet */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <svg
                      className="w-6 h-6 text-zinc-300 dark:text-zinc-700 transform rotate-90 md:rotate-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '85%', label: 'Average Score Improvement' },
            { value: '< 30s', label: 'Analysis Time' },
            { value: '50+', label: 'ATS Systems Tested' },
            { value: '10k+', label: 'CVs Optimized' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
