import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiMail } from 'react-icons/fi'

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      setIsAuthenticated(true)
      setUserRole(data.role)
      navigate(data.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/30 via-base-200 to-accent/20"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="backdrop-blur-md bg-base-100/80 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-base-300"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-6"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="bg-primary rounded-full p-3 mb-2 shadow-lg"
          >
            <FiLock className="text-white text-3xl" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-base-content mb-1 tracking-tight">Login</h2>
          <p className="text-base-content/60">Welcome back! Please login to your account.</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-error mb-4"
          >
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-base font-medium">Email</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered pl-10 w-full focus:input-primary transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-base font-medium">Password</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered pl-10 w-full focus:input-primary transition-all"
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
            className={`btn btn-primary w-full mt-2 shadow-md ${
              isLoading ? 'loading' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center my-6"
        >
          <div className="flex-grow border-t border-base-300" />
          <span className="mx-4 text-base-content/60">OR</span>
          <div className="flex-grow border-t border-base-300" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-base-content/70">
            Don't have an account?{' '}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="link link-primary font-semibold"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Login 