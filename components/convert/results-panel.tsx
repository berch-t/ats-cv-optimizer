'use client'

import { motion } from 'framer-motion'
import {
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Award,
  Target,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils/cn'
import {
  formatATSScore,
  getScoreColor,
  getScoreLabel,
  getScoreBgColor,
} from '@/lib/utils/formatters'
import type { CVAnalysisResult } from '@/types/cv'

interface ResultsPanelProps {
  result: CVAnalysisResult | null
  originalPdfUrl: string | null
  optimizedPdfUrl: string | null
  isLoading?: boolean
}

export function ResultsPanel({
  result,
  originalPdfUrl,
  optimizedPdfUrl,
  isLoading = false,
}: ResultsPanelProps) {
  if (isLoading || !result) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <FileText className="h-8 w-8 text-zinc-400" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            {isLoading
              ? 'Analyzing your CV...'
              : 'Upload a CV to see the analysis results'}
          </p>
        </div>
      </div>
    )
  }

  const { atsCompatibility, recommendations } = result

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Score Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-sky-500" />
              ATS Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {/* Score Circle */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-zinc-200 dark:text-zinc-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(atsCompatibility.overall / 100) * 251.2} 251.2`}
                  />
                  <defs>
                    <linearGradient
                      id="scoreGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {formatATSScore(atsCompatibility.overall)}
                  </span>
                </div>
              </div>

              {/* Score Label */}
              <div>
                <Badge
                  className={cn(
                    'mb-2',
                    atsCompatibility.overall >= 80
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : atsCompatibility.overall >= 60
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  )}
                >
                  {getScoreLabel(atsCompatibility.overall)}
                </Badge>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Your CV is{' '}
                  {atsCompatibility.overall >= 80
                    ? 'well-optimized for ATS systems.'
                    : atsCompatibility.overall >= 60
                    ? 'partially compatible with ATS systems.'
                    : 'not optimized for ATS systems.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: 'Formatting',
                score: atsCompatibility.breakdown.formatting,
                weight: '40%',
              },
              {
                label: 'Keywords',
                score: atsCompatibility.breakdown.keywords,
                weight: '30%',
              },
              {
                label: 'Structure',
                score: atsCompatibility.breakdown.structure,
                weight: '20%',
              },
              {
                label: 'Readability',
                score: atsCompatibility.breakdown.readability,
                weight: '10%',
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {item.label}{' '}
                    <span className="text-zinc-400 dark:text-zinc-500">
                      ({item.weight})
                    </span>
                  </span>
                  <span className={cn('font-medium', getScoreColor(item.score))}>
                    {formatATSScore(item.score)}
                  </span>
                </div>
                <Progress value={item.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="improvements">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="improvements">Improvements</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
              </TabsList>
              <TabsContent value="improvements" className="mt-4 space-y-3">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg',
                      rec.priority === 'high'
                        ? 'bg-red-50 dark:bg-red-900/20'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20'
                        : 'bg-green-50 dark:bg-green-900/20'
                    )}
                  >
                    {rec.priority === 'high' ? (
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : rec.priority === 'medium' ? (
                      <TrendingUp className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={cn(
                          'text-sm font-medium',
                          rec.priority === 'high'
                            ? 'text-red-700 dark:text-red-300'
                            : rec.priority === 'medium'
                            ? 'text-yellow-700 dark:text-yellow-300'
                            : 'text-green-700 dark:text-green-300'
                        )}
                      >
                        {rec.title}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {rec.suggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="keywords" className="mt-4">
                <div className="space-y-4">
                  {atsCompatibility.missingKeywords &&
                    atsCompatibility.missingKeywords.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Missing Keywords
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {atsCompatibility.missingKeywords.map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="outline"
                              className="border-red-200 text-red-600 dark:border-red-800 dark:text-red-400"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  {atsCompatibility.foundKeywords &&
                    atsCompatibility.foundKeywords.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Found Keywords
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {atsCompatibility.foundKeywords.map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="outline"
                              className="border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Download Section */}
      {optimizedPdfUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-sky-900/20 dark:to-emerald-900/20 border-sky-200 dark:border-sky-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                  Your Optimized CV is Ready!
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Download your ATS-optimized CV now
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
                    asChild
                  >
                    <a href={optimizedPdfUrl} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </a>
                  </Button>
                  {originalPdfUrl && (
                    <Button variant="outline" asChild>
                      <a href={originalPdfUrl} download>
                        Original
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
