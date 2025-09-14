import { Request, Response, NextFunction } from 'express'
import { JWTUtil } from '@/utils/jwt'
import { prisma } from '@/index'
import { AppError } from '@/middleware/errorHandler'
import { UserRole } from '@shared'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: UserRole
  }
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401, 'NO_TOKEN')
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (!token) {
      throw new AppError('No token provided', 401, 'NO_TOKEN')
    }

    // Verify the token
    const decoded = JWTUtil.verifyAccessToken(token)
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      throw new AppError('User not found', 401, 'USER_NOT_FOUND')
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    if (error instanceof AppError) {
      next(error)
    } else {
      next(new AppError('Invalid token', 401, 'INVALID_TOKEN'))
    }
  }
}

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'))
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS'))
    }

    next()
  }
}

export const requireWorkspaceAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED')
    }

    const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId

    if (!workspaceId) {
      throw new AppError('Workspace ID required', 400, 'WORKSPACE_ID_REQUIRED')
    }

    // Check if user has access to workspace
    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspaceId as string,
          userId: req.user.id,
        },
      },
    })

    if (!workspaceMember && req.user.role !== UserRole.ADMIN) {
      throw new AppError('Access denied to workspace', 403, 'WORKSPACE_ACCESS_DENIED')
    }

    next()
  } catch (error) {
    next(error)
  }
}