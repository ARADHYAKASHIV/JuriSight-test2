import { Request, Response, NextFunction } from 'express'
import winston from 'winston'
import path from 'path'

// Create logger configuration
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Create winston logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'jurisight-backend' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs', 'error.log'), 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
})

// If we're not in production, log to the console with a simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }))
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  // Log request
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    requestId: req.headers['x-request-id'] || 'unknown'
  })

  // Listen for response finish event
  res.on('finish', () => {
    const duration = Date.now() - start
    
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      contentLength: res.get('Content-Length'),
      requestId: req.headers['x-request-id'] || 'unknown'
    })
  })

  next()
}

// Error logging middleware
export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Request error', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      ip: req.ip,
    },
    requestId: req.headers['x-request-id'] || 'unknown'
  })

  next(error)
}

// Performance monitoring
export const performanceLogger = {
  startTimer: (operation: string) => {
    const start = process.hrtime.bigint()
    return {
      end: (metadata?: Record<string, any>) => {
        const end = process.hrtime.bigint()
        const duration = Number(end - start) / 1e6 // Convert to milliseconds
        
        logger.info('Performance metric', {
          operation,
          duration,
          ...metadata
        })
        
        return duration
      }
    }
  },

  logDatabaseQuery: (query: string, duration: number, rowCount?: number) => {
    logger.info('Database query', {
      type: 'database',
      query: query.substring(0, 500), // Truncate long queries
      duration,
      rowCount,
    })
  },

  logAIRequest: (service: string, operation: string, duration: number, tokens?: number) => {
    logger.info('AI service request', {
      type: 'ai_service',
      service,
      operation,
      duration,
      tokens,
    })
  },

  logCacheOperation: (operation: string, key: string, hit: boolean, duration?: number) => {
    logger.info('Cache operation', {
      type: 'cache',
      operation,
      key: key.substring(0, 100), // Truncate long keys
      hit,
      duration,
    })
  }
}

// System metrics logger
export const systemMetrics = {
  logMemoryUsage: () => {
    const memUsage = process.memoryUsage()
    logger.info('Memory usage', {
      type: 'system_metrics',
      rss: memUsage.rss,
      heapTotal: memUsage.heapTotal,
      heapUsed: memUsage.heapUsed,
      external: memUsage.external,
    })
  },

  logCPUUsage: () => {
    const cpuUsage = process.cpuUsage()
    logger.info('CPU usage', {
      type: 'system_metrics',
      user: cpuUsage.user,
      system: cpuUsage.system,
    })
  },

  startPeriodicLogging: (interval: number = 60000) => {
    setInterval(() => {
      systemMetrics.logMemoryUsage()
      systemMetrics.logCPUUsage()
    }, interval)
  }
}

// Business metrics logger
export const businessMetrics = {
  logUserActivity: (userId: string, action: string, metadata?: Record<string, any>) => {
    logger.info('User activity', {
      type: 'business_metrics',
      userId,
      action,
      timestamp: new Date().toISOString(),
      ...metadata
    })
  },

  logDocumentOperation: (operation: string, documentId: string, userId: string, duration?: number) => {
    logger.info('Document operation', {
      type: 'business_metrics',
      operation,
      documentId,
      userId,
      duration,
      timestamp: new Date().toISOString(),
    })
  },

  logAPIUsage: (endpoint: string, method: string, userId?: string, duration?: number) => {
    logger.info('API usage', {
      type: 'business_metrics',
      endpoint,
      method,
      userId,
      duration,
      timestamp: new Date().toISOString(),
    })
  }
}

// Security events logger
export const securityLogger = {
  logAuthAttempt: (email: string, success: boolean, ip: string, userAgent: string) => {
    logger.warn('Authentication attempt', {
      type: 'security',
      event: 'auth_attempt',
      email,
      success,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    })
  },

  logSuspiciousActivity: (description: string, userId?: string, ip?: string, metadata?: Record<string, any>) => {
    logger.warn('Suspicious activity', {
      type: 'security',
      event: 'suspicious_activity',
      description,
      userId,
      ip,
      timestamp: new Date().toISOString(),
      ...metadata
    })
  },

  logRateLimitExceeded: (ip: string, endpoint: string, attempts: number) => {
    logger.warn('Rate limit exceeded', {
      type: 'security',
      event: 'rate_limit_exceeded',
      ip,
      endpoint,
      attempts,
      timestamp: new Date().toISOString(),
    })
  }
}

export default logger