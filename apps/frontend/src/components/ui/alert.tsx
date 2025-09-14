import React from 'react'
import { AlertTriangle, CheckCircle, Info, X, AlertCircle } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Button } from './button'

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/5",
        warning: "border-yellow-500/50 text-yellow-800 dark:text-yellow-300 [&>svg]:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
        success: "border-green-500/50 text-green-800 dark:text-green-300 [&>svg]:text-green-600 bg-green-50 dark:bg-green-900/20",
        info: "border-blue-500/50 text-blue-800 dark:text-blue-300 [&>svg]:text-blue-600 bg-blue-50 dark:bg-blue-900/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  dismissible?: boolean
  onDismiss?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, dismissible, onDismiss, children, ...props }, ref) => {
    const getIcon = () => {
      switch (variant) {
        case 'destructive':
          return <AlertCircle className="h-4 w-4" />
        case 'warning':
          return <AlertTriangle className="h-4 w-4" />
        case 'success':
          return <CheckCircle className="h-4 w-4" />
        case 'info':
          return <Info className="h-4 w-4" />
        default:
          return <Info className="h-4 w-4" />
      }
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={alertVariants({ variant, className })}
        {...props}
      >
        {getIcon()}
        <div className="flex-1">
          {children}
        </div>
        {dismissible && onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-auto p-1"
            onClick={onDismiss}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Dismiss</span>
          </Button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-none tracking-tight ${className || ""}`}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className || ""}`}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }