'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowRight, FileText, Sparkles, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGradientBorder } from '@/components/ui/animated-gradient-border'

// Dynamically import LaserFlow with no SSR to ensure proper client-side initialization
const LaserFlow = dynamic(
  () => import('@/components/ui/laser-flow').then(mod => mod.LaserFlow),
  { ssr: false }
)

export function Hero() {
  // Track if component is mounted to ensure LaserFlow only renders client-side
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 50)

    return () => {
      clearTimeout(timer)
      setIsMounted(false)
    }
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:bg-zinc-950 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
      {/* LaserFlow Background - only in dark mode */}
      <div
        className="absolute inset-x-0 top-0 z-[0] pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500"
        style={{ height: '10vh' }}
      >
        {isMounted && (
          <LaserFlow
            color="#0ea5e9"
            verticalBeamOffset={-1}
            horizontalBeamOffset={-0.03}
            verticalSizing={3.0}
            horizontalSizing={0.5}
            flowSpeed={0.5}
            fogIntensity={0.25}
            wispDensity={1.5}
          />
        )}
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <AnimatedGradientBorder
          borderWidth={2}
          borderRadius="1.5rem"
          gradientColors={['#0ea5e9', '#10b981', '#0ea5e9']}
          animationDuration="4s"
          className="p-8 md:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 px-4 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-400 mb-6"
              >
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered ATS Optimization</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Dépassez les filtres{' '}
                <span className="bg-gradient-to-r from-sky-500 to-emerald-500 dark:from-sky-400 dark:to-emerald-400 bg-clip-text text-transparent">
                ATS
                </span>
                <br />
                Décrochez plus{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-sky-500 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent">
                d’entretiens
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0">
              Plus de 75 % des candidatures sont écartées avant lecture humaine. 
              Notre IA compare votre CV aux exigences des ATS utilisés sur le marché et le restructure 
              pour améliorer sa lisibilité et son score.
              </p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
                  asChild
                >
                  <Link href="/convert">
                    Optimiser mon CV
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                  asChild
                >
                  <Link href="/#how-it-works">Comment ça marche ?</Link>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-zinc-500 dark:text-zinc-400"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                  <span>100% Sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  <span>Résultats instantanés</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                  <span>3 conversions gratuites</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* CV Preview Card */}
              <div className="relative">
                {/* Before Card */}
                <motion.div
                  className="absolute top-0 left-0 w-64 h-80 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-4 transform -rotate-6"
                  whileHover={{ rotate: -3 }}
                >
                  <div className="w-full h-full space-y-3">
                    <div className="h-6 bg-red-100 dark:bg-red-900/30 rounded w-3/4" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/6" />
                    <div className="h-3 bg-red-200 dark:bg-red-800/30 rounded w-full mt-4" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-100 dark:bg-red-900/50 rounded text-xs text-red-600 dark:text-red-400 font-medium">
                    42% ATS Score
                  </div>
                </motion.div>

                {/* After Card */}
                <motion.div
                  className="relative ml-20 mt-10 w-72 h-96 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-4 transform rotate-3"
                  whileHover={{ rotate: 0, scale: 1.02 }}
                >
                  <div className="w-full h-full space-y-3">
                    <div className="h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded w-3/4" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/6" />
                    <div className="h-3 bg-emerald-200 dark:bg-emerald-800/30 rounded w-full mt-4" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-emerald-200 dark:bg-emerald-800/30 rounded w-full mt-4" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 rounded text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    94% ATS Score
                  </div>
                  <motion.div
                    className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-5 w-5 text-white" />
                  </motion.div>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <ArrowRight className="h-8 w-8 text-sky-500 dark:text-sky-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </AnimatedGradientBorder>
      </div>
    </section>
  )
}
