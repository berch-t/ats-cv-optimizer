'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { formatFileSize } from '@/lib/utils/formatters'
import { validateFile, MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/utils/validations'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
  isPremium?: boolean
}

export function UploadZone({ onFileSelect, disabled = false, isPremium = false }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)
      const file = acceptedFiles[0]

      if (!file) return

      const validation = validateFile(file, isPremium)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        return
      }

      setSelectedFile(file)
    },
    [isPremium]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled,
    maxSize: isPremium ? 10 * 1024 * 1024 : MAX_FILE_SIZE,
  })

  const handleClearFile = () => {
    setSelectedFile(null)
    setError(null)
  }

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                'relative group cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200',
                isDragActive && !isDragReject
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                  : isDragReject
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-zinc-300 dark:border-zinc-700 hover:border-sky-400 dark:hover:border-sky-500 bg-zinc-50 dark:bg-zinc-900/50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <input {...getInputProps()} />

              {/* Background Gradient Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  className={cn(
                    'mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors',
                    isDragActive && !isDragReject
                      ? 'bg-sky-100 dark:bg-sky-900/50'
                      : isDragReject
                      ? 'bg-red-100 dark:bg-red-900/50'
                      : 'bg-zinc-100 dark:bg-zinc-800 group-hover:bg-sky-100 dark:group-hover:bg-sky-900/50'
                  )}
                  animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                >
                  {isDragReject ? (
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  ) : (
                    <Upload
                      className={cn(
                        'h-8 w-8 transition-colors',
                        isDragActive
                          ? 'text-sky-500'
                          : 'text-zinc-400 group-hover:text-sky-500'
                      )}
                    />
                  )}
                </motion.div>

                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  {isDragActive
                    ? isDragReject
                      ? 'Invalid file type'
                      : 'Drop your CV here'
                    : 'Drop your CV here or click to browse'}
                </h3>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {isDragReject ? (
                    <span className="text-red-500">Only PDF files are accepted</span>
                  ) : (
                    <>
                      PDF files only, max {formatFileSize(isPremium ? 10 * 1024 * 1024 : MAX_FILE_SIZE)}
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
          >
            <div className="flex items-center gap-4">
              {/* File Icon */}
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <FileText className="h-7 w-7 text-sky-600 dark:text-sky-400" />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 dark:text-white truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  Ready
                </span>
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFile}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Action Button */}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleUpload}
                className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
              >
                <Upload className="mr-2 h-4 w-4" />
                Start Optimization
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 flex items-center gap-2 text-red-500 text-sm"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
