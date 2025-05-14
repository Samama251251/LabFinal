import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiMail } from 'react-icons/fi'
import { login } from '../services/authService'

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void
  setUserRole: (role: 'admin' | 'user') => void
}

function Login({ setIsAuthenticated, setUserRole }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await login({ email, password })

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed')
      }

      // Store token in localStorage
      localStorage.setItem('token', response.data.token)
      
      setIsAuthenticated(true)
      setUserRole(response.data.role)
      
      // Redirect based on role
      if (response.data.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex items-center justify-center bg-base-100"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300"
      >
        <div className="card-body space-y-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4"
            >
              <FiLock className="text-primary-content text-2xl" />
            </motion.div>
            <h2 className="card-title text-3xl font-extrabold text-base-content">Login</h2>
            <p className="text-base-content/60 text-center mt-2">Welcome back! Please login to your account.</p>
          </motion.div>

        {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert alert-error"
            >
            <span>{error}</span>
            </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
            </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            <input
              type="email"
              placeholder="Enter your email"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
            </div>

          <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
            </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            <input
              type="password"
              placeholder="Enter your password"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`btn btn-primary w-full shadow-md transition-all duration-200 ${
                isLoading ? 'loading' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </motion.button>
        </form>

          <div className="text-center mb-2">
            <p className="text-sm text-base-content/70">
              User accounts have standard dashboard access.<br />
              Admin accounts can add device data.
            </p>
          </div>

          <div className="divider text-base-content/60">OR</div>

        <div className="text-center">
            <p className="text-base-content/70">
            Don't have an account?{' '}
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="link link-primary font-semibold hover:link-primary/80"
              onClick={() => navigate('/signup')}
            >
              Sign up
              </motion.button>
          </p>
        </div>
      </div>
      </motion.div>
    </motion.div>
  )
}

export default Login 