import * as React from "react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg 
        className="animate-spin -ml-1 mr-3 text-current" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

interface LoadingDotsProps {
  className?: string
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ className = "" }) => {
  return (
    <div className={`inline-flex space-x-1 ${className}`}>
      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
    </div>
  )
}

interface LoadingBarProps {
  progress?: number
  className?: string
}

const LoadingBar: React.FC<LoadingBarProps> = ({ 
  progress, 
  className = "" 
}) => {
  return (
    <div className={`w-full bg-muted rounded-full h-2 ${className}`}>
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
        style={{ 
          width: progress ? `${Math.min(progress, 100)}%` : '100%',
          ...(progress === undefined && { animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' })
        }}
      />
    </div>
  )
}

export { LoadingSpinner, LoadingDots, LoadingBar }