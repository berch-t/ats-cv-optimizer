'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Search,
  Calendar,
  TrendingUp,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ConversionDocument } from '@/types/api'

export default function HistoryPage() {
  const [conversions, setConversions] = useState<ConversionDocument[]>([])
  const [filteredConversions, setFilteredConversions] = useState<ConversionDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')
  const [selectedConversion, setSelectedConversion] = useState<ConversionDocument | null>(null)

  useEffect(() => {
    const fetchConversions = async () => {
      try {
        const response = await fetch('/api/conversions')
        if (response.ok) {
          const data = await response.json()
          setConversions(data.conversions || [])
          setFilteredConversions(data.conversions || [])
        }
      } catch (error) {
        console.error('Error fetching conversions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversions()
  }, [])

  useEffect(() => {
    let filtered = [...conversions]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.targetSector?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    switch (sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'score-desc':
        filtered.sort((a, b) => (b.score || 0) - (a.score || 0))
        break
      case 'score-asc':
        filtered.sort((a, b) => (a.score || 0) - (b.score || 0))
        break
    }

    setFilteredConversions(filtered)
  }, [conversions, searchQuery, sortBy])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversion?')) return

    try {
      const response = await fetch(`/api/conversions/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setConversions(conversions.filter((c) => c.id !== id))
      }
    } catch (error) {
      console.error('Error deleting conversion:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30'
    if (score >= 60) return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30'
    return 'text-red-600 bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Conversion History
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          View and manage your previous CV optimizations
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by filename or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="score-desc">Highest Score</SelectItem>
                <SelectItem value="score-asc">Lowest Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conversions List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredConversions.length > 0 ? (
        <div className="space-y-4">
          {filteredConversions.map((conversion, index) => (
            <motion.div
              key={conversion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-sky-100 dark:bg-sky-900/30">
                        <FileText className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-zinc-900 dark:text-white">
                          {conversion.fileName || 'CV Document'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(conversion.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          {conversion.targetSector && (
                            <Badge variant="outline">{conversion.targetSector}</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Score */}
                      <div
                        className={`px-3 py-1.5 rounded-lg ${getScoreColor(
                          conversion.score || 0
                        )}`}
                      >
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-semibold">{conversion.score || 0}%</span>
                        </div>
                        <p className="text-xs opacity-80">ATS Score</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedConversion(conversion)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Conversion Details</DialogTitle>
                              <DialogDescription>
                                {conversion.fileName} - {new Date(conversion.createdAt).toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              {/* Score Breakdown */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                                  <p className="text-sm text-zinc-500">Overall</p>
                                  <p className="text-2xl font-bold text-sky-600">
                                    {conversion.score || 0}%
                                  </p>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                                  <p className="text-sm text-zinc-500">Formatting</p>
                                  <p className="text-2xl font-bold">
                                    {conversion.breakdown?.formatting || 0}%
                                  </p>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                                  <p className="text-sm text-zinc-500">Keywords</p>
                                  <p className="text-2xl font-bold">
                                    {conversion.breakdown?.keywords || 0}%
                                  </p>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                                  <p className="text-sm text-zinc-500">Structure</p>
                                  <p className="text-2xl font-bold">
                                    {conversion.breakdown?.structure || 0}%
                                  </p>
                                </div>
                              </div>

                              {/* Recommendations */}
                              {conversion.recommendations && conversion.recommendations.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Recommendations</h4>
                                  <ul className="space-y-2">
                                    {conversion.recommendations.map((rec, i) => (
                                      <li
                                        key={i}
                                        className="text-sm text-zinc-600 dark:text-zinc-400 p-2 bg-zinc-50 dark:bg-zinc-800 rounded"
                                      >
                                        {rec}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Download buttons */}
                              <div className="flex gap-2 pt-4">
                                {conversion.originalPdfUrl && (
                                  <Button variant="outline" asChild>
                                    <a href={conversion.originalPdfUrl} download>
                                      <Download className="h-4 w-4 mr-2" />
                                      Original
                                    </a>
                                  </Button>
                                )}
                                {conversion.optimizedPdfUrl && (
                                  <Button asChild>
                                    <a href={conversion.optimizedPdfUrl} download>
                                      <Download className="h-4 w-4 mr-2" />
                                      Optimized
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {conversion.optimizedPdfUrl && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={conversion.optimizedPdfUrl} download>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => handleDelete(conversion.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
              <h3 className="font-medium text-zinc-900 dark:text-white mb-2">
                No conversions found
              </h3>
              <p className="text-sm text-zinc-500 mb-4">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Start by uploading your first CV'}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <a href="/convert">Upload CV</a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
