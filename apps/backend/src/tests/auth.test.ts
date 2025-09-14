import { describe, it, expect } from '@jest/globals'
import { JWTUtil } from '../utils/jwt'
import { UserRole } from '@shared'

// Mock the prisma dependency
jest.mock('@/index', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    }
  }
}))

describe('Authentication Utilities', () => {
  describe('JWT Token Generation', () => {
    it('should generate access and refresh tokens', () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: UserRole.ANALYST,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const tokens = JWTUtil.generateTokenPair(mockUser)

      expect(tokens).toHaveProperty('accessToken')
      expect(tokens).toHaveProperty('refreshToken')
      expect(typeof tokens.accessToken).toBe('string')
      expect(typeof tokens.refreshToken).toBe('string')
    })

    it('should generate access token only', () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: UserRole.ANALYST,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const token = JWTUtil.generateAccessToken(mockUser)

      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })
  })

  describe('JWT Token Verification', () => {
    it('should verify valid access token', () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: UserRole.ANALYST,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const token = JWTUtil.generateAccessToken(mockUser)
      const decoded = JWTUtil.verifyAccessToken(token)

      expect(decoded).toHaveProperty('userId')
      expect(decoded).toHaveProperty('email')
      expect(decoded).toHaveProperty('role')
      expect(decoded.userId).toBe(mockUser.id)
    })

    it('should verify valid refresh token', () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: UserRole.ANALYST,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const tokens = JWTUtil.generateTokenPair(mockUser)
      const decoded = JWTUtil.verifyRefreshToken(tokens.refreshToken)

      expect(decoded).toHaveProperty('userId')
      expect(decoded.userId).toBe(mockUser.id)
    })
  })
})