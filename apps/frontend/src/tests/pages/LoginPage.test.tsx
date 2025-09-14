import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import LoginPage from '../../pages/auth/LoginPage'

// Mock the auth store
vi.mock('../../stores/authStore')

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

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form', () => {
    const mockUseAuthStore = vi.mocked(useAuthStore)
    mockUseAuthStore.mockReturnValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
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

    renderWithProviders(<LoginPage />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    const mockUseAuthStore = vi.mocked(useAuthStore)
    mockUseAuthStore.mockReturnValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
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

    renderWithProviders(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('should show error for invalid email format', async () => {
    const mockUseAuthStore = vi.mocked(useAuthStore)
    mockUseAuthStore.mockReturnValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
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

    renderWithProviders(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    })
  })

  it('should show loading state during login', () => {
    const mockUseAuthStore = vi.mocked(useAuthStore)
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

    renderWithProviders(<LoginPage />)
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
  })

  it('should display error message when login fails', () => {
    const mockUseAuthStore = vi.mocked(useAuthStore)
    mockUseAuthStore.mockReturnValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Invalid credentials',
      setAuth: vi.fn(),
      clearAuth: vi.fn(),
      setUser: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
    })

    renderWithProviders(<LoginPage />)
    
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })
})
