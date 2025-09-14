import { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/logger'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  // Log request
  logger.info(`${req.method} ${req.url} - ${req.ip}`)

  // Override res.end to log response
  const originalEnd = res.end
  res.end = function(chunk?: any, encoding?: any, cb?: any): Response {
    const duration = Date.now() - start
    
    logger.info(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`)

    return originalEnd.call(this, chunk, encoding, cb) as Response
  }

  next()
}