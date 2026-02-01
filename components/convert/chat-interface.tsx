'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ConversionMessage } from '@/types/cv'

interface ChatInterfaceProps {
  messages: ConversionMessage[]
  isLoading?: boolean
}

export function ChatInterface({ messages, isLoading = false }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Determine if message is an error type
  const isErrorMessage = (message: ConversionMessage) => message.type === 'error'

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex gap-3',
                message.role === 'user' && 'flex-row-reverse'
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                  message.role === 'assistant' &&
                    'bg-gradient-to-br from-sky-500 to-emerald-500',
                  message.role === 'user' && 'bg-zinc-200 dark:bg-zinc-700',
                  message.role === 'system' && !isErrorMessage(message) && 'bg-zinc-100 dark:bg-zinc-800',
                  isErrorMessage(message) && 'bg-red-100 dark:bg-red-900/30'
                )}
              >
                {message.role === 'assistant' && (
                  <Bot className="h-4 w-4 text-white" />
                )}
                {message.role === 'user' && (
                  <User className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                )}
                {message.role === 'system' && !isErrorMessage(message) && (
                  <Sparkles className="h-4 w-4 text-sky-500" />
                )}
                {isErrorMessage(message) && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={cn(
                  'flex-1 max-w-[80%] rounded-2xl px-4 py-3',
                  message.role === 'assistant' &&
                    'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700',
                  message.role === 'user' &&
                    'bg-sky-500 text-white ml-auto',
                  message.role === 'system' && !isErrorMessage(message) &&
                    'bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800',
                  isErrorMessage(message) &&
                    'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                )}
              >
                <div
                  className={cn(
                    'text-sm whitespace-pre-wrap',
                    message.role === 'user' && 'text-white',
                    message.role === 'assistant' &&
                      'text-zinc-700 dark:text-zinc-300',
                    message.role === 'system' && !isErrorMessage(message) &&
                      'text-sky-700 dark:text-sky-300',
                    isErrorMessage(message) && 'text-red-700 dark:text-red-300'
                  )}
                >
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Analyzing...
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
