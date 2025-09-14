import { Request } from 'express'
import { UserRole } from '../shared'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: UserRole
  }
}

export interface AuthTokenPayload {
  userId: string
  email: string
  role: UserRole
  type: 'access' | 'refresh'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  email?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}