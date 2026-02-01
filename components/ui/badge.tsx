import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-500 text-white',
        secondary:
          'border-transparent bg-neutral-100 text-neutral-900',
        destructive:
          'border-transparent bg-danger-500 text-white',
        outline: 'text-foreground border-neutral-300',
        success:
          'border-transparent bg-success-100 text-success-700',
        warning:
          'border-transparent bg-warning-100 text-warning-700',
        info:
          'border-transparent bg-primary-100 text-primary-700',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'mr-1.5 h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-success-500',
            variant === 'warning' && 'bg-warning-500',
            variant === 'destructive' && 'bg-danger-500',
            variant === 'info' && 'bg-primary-500',
            (!variant || variant === 'default') && 'bg-white',
            variant === 'secondary' && 'bg-neutral-500',
            variant === 'outline' && 'bg-neutral-500'
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
