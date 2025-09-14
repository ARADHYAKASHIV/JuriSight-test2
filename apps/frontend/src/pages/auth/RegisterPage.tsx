import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading'

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    try {
      // Registration logic would go here
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-legal-blue/5 via-background to-legal-navy/5 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-legal-blue to-legal-navy rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">J</span>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Join JuriSight</h1>
            <p className="text-muted-foreground">Start analyzing legal documents with AI</p>
          </div>
        </div>
        
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Get started with AI-powered legal analysis
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="h-11"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-sm font-medium">
                    Organization <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="organization"
                    name="organization"
                    type="text"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Law Firm or Company"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required
                    className="w-4 h-4 rounded border-input bg-background mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer leading-5">
                    I agree to the{' '}
                    <Link to="/terms" className="text-legal-blue hover:text-legal-navy">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-legal-blue hover:text-legal-navy">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="newsletter" 
                    className="w-4 h-4 rounded border-input bg-background mt-0.5"
                  />
                  <Label htmlFor="newsletter" className="text-sm cursor-pointer leading-5">
                    Send me product updates and legal industry insights
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                variant="legal"
                className="w-full h-11 text-base font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-legal-blue hover:text-legal-navy font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Security notice */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>🔒 Your data is encrypted and secure</p>
            <p>⚡ Start analyzing documents immediately after signup</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
export { RegisterPage }