import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import DashboardPage from '../../pages/DashboardPage'

// Mock the stores
vi.mock('../../stores/authStore')
vi.mock('../../stores/workspaceStore')

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dashboard with user information', () => {
    const mockUseAuthStore = vi.mocked(useAuthStore)
    const mockUseWorkspaceStore = vi.mocked(useWorkspaceStore)
    
    mockUseAuthStore.mockReturnValue({
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'ANALYST',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      accessToken: 'token',
      refreshToken: 'refresh',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      setAuth: vi.fn(),
      clearAuth: vi.fn(),
      setUser: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
    })

    mockUseWorkspaceStore.mockReturnValue({
      workspaces: [],
      currentWorkspace: null,
      isLoading: false,
      error: null,
      setWorkspaces: vi.fn(),
      setCurrentWorkspace: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
    })

    renderWithProviders(<DashboardPage />)
    
    expect(screen.getByText(/welcome/i)).toBeInTheDocument()
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
  })

  it('should show loading state', () => {
    const mockUseAuthStore = vi.mocked(useAuthStore)
    const mockUseWorkspaceStore = vi.mocked(useWorkspaceStore)
    
    mockUseAuthStore.mockReturnValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      setAuth: vi.fn(),
      clearAuth: vi.fn(),
      setUser: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
    })

    mockUseWorkspaceStore.mockReturnValue({
      workspaces: [],
      currentWorkspace: null,
      isLoading: true,
      error: null,
      setWorkspaces: vi.fn(),
      setCurrentWorkspace: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
    })

    renderWithProviders(<DashboardPage />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should display workspaces when available', () => {
    const mockUseAuthStore = vi.mocked(useAuthStore)
    const mockUseWorkspaceStore = vi.mocked(useWorkspaceStore)
    
    mockUseAuthStore.mockReturnValue({
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'ANALYST',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      accessToken: 'token',
      refreshToken: 'refresh',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      setAuth: vi.fn(),
      clearAuth: vi.fn(),
      setUser: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
    })

    mockUseWorkspaceStore.mockReturnValue({
      workspaces: [
        {
          id: '1',
          name: 'Test Workspace',
          ownerId: '1',
          settings: {},
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      currentWorkspace: null,
      isLoading: false,
      error: null,
      setWorkspaces: vi.fn(),
      setCurrentWorkspace: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
    })

    renderWithProviders(<DashboardPage />)
    
    expect(screen.getByText(/test workspace/i)).toBeInTheDocument()
  })

  it('should show create workspace button', () => {
    const mockUseAuthStore = vi.mocked(useAuthStore)
    const mockUseWorkspaceStore = vi.mocked(useWorkspaceStore)
    
    mockUseAuthStore.mockReturnValue({
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'ANALYST',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      accessToken: 'token',
      refreshToken: 'refresh',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      setAuth: vi.fn(),
      clearAuth: vi.fn(),
      setUser: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
    })

    mockUseWorkspaceStore.mockReturnValue({
      workspaces: [],
      currentWorkspace: null,
      isLoading: false,
      error: null,
      setWorkspaces: vi.fn(),
      setCurrentWorkspace: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
    })

    renderWithProviders(<DashboardPage />)
    
    expect(screen.getByRole('button', { name: /create workspace/i })).toBeInTheDocument()
  })

  it('should display error message when there is an error', () => {
    const mockUseAuthStore = vi.mocked(useAuthStore)
    const mockUseWorkspaceStore = vi.mocked(useWorkspaceStore)
    
    mockUseAuthStore.mockReturnValue({
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'ANALYST',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      accessToken: 'token',
      refreshToken: 'refresh',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      setAuth: vi.fn(),
      clearAuth: vi.fn(),
      setUser: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
    })

    mockUseWorkspaceStore.mockReturnValue({
      workspaces: [],
      currentWorkspace: null,
      isLoading: false,
      error: 'Failed to load workspaces',
      setWorkspaces: vi.fn(),
      setCurrentWorkspace: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
    })

    renderWithProviders(<DashboardPage />)
    
    expect(screen.getByText(/failed to load workspaces/i)).toBeInTheDocument()
  })
})
