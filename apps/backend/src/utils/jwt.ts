import jwt from 'jsonwebtoken'
import { User } from '@shared'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export class JWTUtil {
  private static readonly ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'test-access-secret'
  private static readonly REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret'
  private static readonly ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
  private static readonly REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

  static generateAccessToken(user: Omit<User, 'password'>): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions)
  }

  static generateRefreshToken(user: Omit<User, 'password'>): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions)
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.ACCESS_TOKEN_SECRET) as JWTPayload
    } catch (error) {
      throw new Error('Invalid access token')
    }
  }

  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.REFRESH_TOKEN_SECRET) as JWTPayload
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }

  static generateTokenPair(user: Omit<User, 'password'>) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    }
  }
}

export default JWTUtil