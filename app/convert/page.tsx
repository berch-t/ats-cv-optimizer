'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Sparkles, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { UploadZone } from '@/components/convert/upload-zone'
import { ChatInterface } from '@/components/convert/chat-interface'
import { ResultsPanel } from '@/components/convert/results-panel'
import { useConversion } from '@/lib/hooks/use-conversion'
import { useAuthContext } from '@/components/providers'
import { cn } from '@/lib/utils/cn'

export default function ConvertPage() {
  const {
    status,
    progress,
    messages,
    result,
    originalPdfUrl,
    optimizedPdfUrl,
    isConverting,
    isComplete,
    hasError,
    startConversion,
    resetConversion,
  } = useConversion()

  const { isPremium, isAuthenticated } = useAuthContext()
  const [showResults, setShowResults] = useState(false)

  const handleFileSelect = async (file: File) => {
    setShowResults(false)
    await startConversion(file)
  }

  const handleReset = () => {
    resetConversion()
    setShowResults(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-sky-900/30 px-4 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-300 mb-4">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered ATS Optimization</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Optimize Your CV for{' '}
              <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
                ATS Success
              </span>
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Upload your CV and let our AI analyze and optimize it for maximum
              ATS compatibility.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {status === 'idle' && !isComplete ? (
            // Upload State
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <UploadZone
                onFileSelect={handleFileSelect}
                isPremium={isPremium}
              />

              {/* Features List */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: '🔍', text: 'ATS Compatibility Analysis' },
                  { icon: '🎯', text: 'Keyword Optimization' },
                  { icon: '📄', text: 'Format Correction' },
                ].map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Usage Info */}
              {!isAuthenticated && (
                <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  Sign up for free to track your conversions and access more
                  features.
                </p>
              )}
            </motion.div>
          ) : (
            // Processing/Results State
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[calc(100vh-20rem)]"
            >
              {/* Progress Bar */}
              {isConverting && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    <span>
                      {status === 'uploading'
                        ? 'Uploading...'
                        : status === 'analyzing'
                        ? 'Analyzing CV...'
                        : 'Generating optimized CV...'}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Main Layout */}
              <div className="grid lg:grid-cols-2 gap-6 h-full">
                {/* Chat Panel */}
                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-white">
                        AI Analysis
                      </span>
                    </div>
                    {(isComplete || hasError) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-zinc-500"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        New Analysis
                      </Button>
                    )}
                  </div>
                  <div className="h-[calc(100%-3.5rem)]">
                    <ChatInterface
                      messages={messages}
                      isLoading={isConverting && messages.length === 0}
                    />
                  </div>
                </div>

                {/* Results Panel */}
                <div
                  className={cn(
                    'bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden',
                    'lg:block',
                    showResults ? 'block' : 'hidden'
                  )}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="font-medium text-zinc-900 dark:text-white">
                      Results
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setShowResults(false)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Chat
                    </Button>
                  </div>
                  <div className="h-[calc(100%-3.5rem)]">
                    <ResultsPanel
                      result={result}
                      originalPdfUrl={originalPdfUrl}
                      optimizedPdfUrl={optimizedPdfUrl}
                      isLoading={isConverting}
                    />
                  </div>
                </div>

                {/* Mobile Toggle */}
                {isComplete && !showResults && (
                  <div className="lg:hidden fixed bottom-4 left-4 right-4">
                    <Button
                      className="w-full bg-gradient-to-r from-sky-500 to-emerald-500"
                      onClick={() => setShowResults(true)}
                    >
                      View Results
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
