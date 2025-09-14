// Fix the imports in App.tsx to use the correct paths
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Layout from '@/components/layout/Layout'
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import { 
  RegisterPage,
  DocumentsPage,
  DocumentViewerPage,
  ChatPage,
  ComparisonPage,
  AnalyticsPage,
  SettingsPage,
  WorkspacesPage,
  NotFoundPage
} from '@/pages/index'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="jurisight-ui-theme">
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="documents/:id" element={<DocumentViewerPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="chat/:sessionId" element={<ChatPage />} />
              <Route path="comparison" element={<ComparisonPage />} />
              <Route path="comparison/:id" element={<ComparisonPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="workspaces" element={<WorkspacesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App