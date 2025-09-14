import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserRole, PublicUser } from '@/shared'

interface AuthState {
  user: PublicUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  rememberMe: boolean
  sessionTimeout: number | null
  lastActivity: number | null
}

interface AuthActions {
  setAuth: (user: PublicUser, accessToken: string, refreshToken: string, rememberMe?: boolean) => void
  clearAuth: () => void
  setUser: (user: PublicUser) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setRememberMe: (remember: boolean) => void
  updateLastActivity: () => void
  checkSessionTimeout: () => boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false,
      sessionTimeout: null,
      lastActivity: null,

      // Actions
      setAuth: (user, accessToken, refreshToken, rememberMe = false) => {
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem('accessToken', accessToken)
        storage.setItem('refreshToken', refreshToken)
        storage.setItem('rememberMe', rememberMe.toString())
        
        const sessionTimeout = rememberMe ? Date.now() + (7 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000) // 7 days or 24 hours
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          rememberMe,
          sessionTimeout,
          lastActivity: Date.now(),
          error: null,
        })
      },

      clearAuth: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('rememberMe')
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('refreshToken')
        sessionStorage.removeItem('rememberMe')
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          rememberMe: false,
          sessionTimeout: null,
          lastActivity: null,
          error: null,
        })
      },

      setUser: (user) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      setRememberMe: (rememberMe) => set({ rememberMe }),

      updateLastActivity: () => set({ lastActivity: Date.now() }),

      checkSessionTimeout: () => {
        const { sessionTimeout, lastActivity } = get()
        if (!sessionTimeout || !lastActivity) return false
        
        const now = Date.now()
        const inactivityTimeout = 30 * 60 * 1000 // 30 minutes
        
        if (now > sessionTimeout || (now - lastActivity) > inactivityTimeout) {
          get().clearAuth()
          return true
        }
        return false
      },

      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },

      hasAnyRole: (roles) => {
        const { user } = get()
        return user ? roles.includes(user.role) : false
      },
    }),
    {
      name: 'jurisight-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)