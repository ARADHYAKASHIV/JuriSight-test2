import React, { createContext, useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/api'
import { PublicUser } from '@shared'

interface AuthContextType {
  user: PublicUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, confirmPassword: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    isAuthenticated,
    accessToken,
    isLoading,
    error,
    setAuth,
    clearAuth,
    setUser,
    setLoading,
    setError,
  } = useAuthStore()

  // Query to fetch user profile if we have a token but no user data
  const { data: profileData } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authApi.getProfile(),
    enabled: !!accessToken && !user,
    retry: 1,
    staleTime: Infinity,
  })

  // Update user data when profile is fetched
  useEffect(() => {
    if (profileData?.success && profileData.data) {
      setUser(profileData.data)
    }
  }, [profileData, setUser])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await authApi.login({ email, password })
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data
        setAuth(user, accessToken, refreshToken)
      } else {
        throw new Error(response.error?.message || 'Login failed')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, confirmPassword: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await authApi.register({ email, password, confirmPassword })
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data
        setAuth(user, accessToken, refreshToken)
      } else {
        throw new Error(response.error?.message || 'Registration failed')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearAuth()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider