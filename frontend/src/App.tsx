import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import { DeviceDataProvider } from './context/DeviceDataContext'
import { getCurrentUser } from './services/authService'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if the user is already authenticated (has a token)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        try {
          const response = await getCurrentUser(token)
          
          if (response.success && response.data) {
            setIsAuthenticated(true)
            setUserRole(response.data.role)
          } else {
            // Token is invalid or expired
            localStorage.removeItem('token')
          }
        } catch (error) {
          console.error('Authentication check failed:', error)
          localStorage.removeItem('token')
        }
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Function to determine where to redirect after login
  const getRedirectPath = () => {
    if (!isAuthenticated) return '/login'
    return userRole === 'admin' ? '/admin' : '/dashboard'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-base-100">
        <Routes>
          <Route path="/login" element={
            isAuthenticated 
              ? <Navigate to={getRedirectPath()} replace /> 
              : <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
          } />
          <Route path="/signup" element={
            isAuthenticated 
              ? <Navigate to={getRedirectPath()} replace /> 
              : <Signup setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
          } />
          <Route path="/dashboard" element={
            isAuthenticated 
              ? userRole === 'admin'
                ? <Navigate to="/admin" replace />
                : <DeviceDataProvider><Dashboard userRole={userRole} setIsAuthenticated={setIsAuthenticated} /></DeviceDataProvider>
              : <Navigate to="/login" replace />
          } />
          <Route path="/admin" element={
            isAuthenticated 
              ? userRole === 'admin'
                ? <AdminDashboard setIsAuthenticated={setIsAuthenticated} />
                : <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          } />
          <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
