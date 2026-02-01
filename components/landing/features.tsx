'use client'

import { motion } from 'framer-motion'
import {
  Bot,
  FileSearch,
  Wand2,
  FileText,
  BarChart3,
  Download,
  Zap,
  Shield,
} from 'lucide-react'

const features = [
  {
    icon: FileSearch,
    title: 'ATS Analysis',
    description:
      'Scan your CV against real ATS systems like Taleo, Workday, and Greenhouse to identify compatibility issues.',
    color: 'from-sky-500 to-blue-600',
  },
  {
    icon: Bot,
    title: 'AI-Powered Optimization',
    description:
      'Our Claude AI analyzes your CV structure, keywords, and formatting to provide actionable improvements.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Wand2,
    title: 'Smart Keyword Matching',
    description:
      'Automatically identifies missing industry keywords and suggests relevant additions to boost your score.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: FileText,
    title: 'Format Correction',
    description:
      'Fixes common formatting issues like tables, images, and complex layouts that confuse ATS parsers.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: BarChart3,
    title: 'Detailed Scoring',
    description:
      'Get a comprehensive breakdown of your ATS score across formatting, keywords, structure, and readability.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Download,
    title: 'Multiple Export Formats',
    description:
      'Download your optimized CV in PDF, DOCX, or plain text formats for different application requirements.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description:
      'Get your optimized CV in seconds with real-time streaming feedback as our AI processes your document.',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description:
      'Your CV data is encrypted and never stored permanently. We take your privacy seriously.',
    color: 'from-green-500 to-emerald-600',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-sky-900/30 px-4 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-300 mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
              Beat the ATS
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Our comprehensive suite of tools analyzes, optimizes, and transforms
            your CV to maximize your chances of landing interviews.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-lg"
            >
              {/* Icon */}
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
