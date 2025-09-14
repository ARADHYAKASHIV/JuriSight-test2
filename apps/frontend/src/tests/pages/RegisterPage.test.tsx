import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import RegisterPage from '../../pages/auth/RegisterPage'

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

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render registration form', () => {
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

    renderWithProviders(<RegisterPage />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
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

    renderWithProviders(<RegisterPage />)
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      expect(screen.getByText(/confirm password is required/i)).toBeInTheDocument()
    })
  })

  it('should show error for password mismatch', async () => {
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

    renderWithProviders(<RegisterPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/^password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
    })
  })

  it('should show error for weak password', async () => {
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

    renderWithProviders(<RegisterPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/^password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: '123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('should show loading state during registration', () => {
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

    renderWithProviders(<RegisterPage />)
    
    expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled()
  })

  it('should display error message when registration fails', () => {
    const mockUseAuthStore = vi.mocked(useAuthStore)
    mockUseAuthStore.mockReturnValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Email already exists',
      setAuth: vi.fn(),
      clearAuth: vi.fn(),
      setUser: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
    })

    renderWithProviders(<RegisterPage />)
    
    expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
  })
})
