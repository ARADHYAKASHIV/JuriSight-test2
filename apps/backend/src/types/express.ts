import { Request, Response, NextFunction, RequestHandler } from 'express'
import { UserRole } from '../shared'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: UserRole
  }
}

export type AuthenticatedRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void

export type AuthenticatedRoute = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>

// Type-safe wrapper for authenticated routes
export const withAuth = (handler: AuthenticatedRoute): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await handler(req as AuthenticatedRequest, res, next)
  }
}