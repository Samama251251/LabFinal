import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiMail, FiUser, FiUserCheck } from 'react-icons/fi'
import { signup } from '../services/authService'

interface SignupProps {
  setIsAuthenticated: (value: boolean) => void
  setUserRole: (role: 'admin' | 'user') => void
}

function Signup({ setIsAuthenticated, setUserRole }: SignupProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      // @ts-expect-error - Include role in the request
      const response = await signup({ name, email, password, role })

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Signup failed')
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
      console.error('Signup error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create account')
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
              <FiUser className="text-primary-content text-2xl" />
            </motion.div>
            <h2 className="card-title text-3xl font-extrabold text-base-content">Sign Up</h2>
            <p className="text-base-content/60 text-center mt-2">Create your account to get started</p>
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
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
          </div>

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
                  placeholder="Create a password"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">Password must be at least 6 characters</span>
              </label>
            </div>

          <div className="form-control">
            <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
            </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            <input
              type="password"
              placeholder="Confirm your password"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Account Type</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    className="radio radio-primary"
                    name="role"
                    checked={role === 'user'}
                    onChange={() => setRole('user')}
                  />
                  <span className="flex items-center gap-1">
                    <FiUser className="text-base-content/70" />
                    User
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    className="radio radio-secondary"
                    name="role"
                    checked={role === 'admin'}
                    onChange={() => setRole('admin')}
                  />
                  <span className="flex items-center gap-1">
                    <FiUserCheck className="text-base-content/70" />
                    Admin
                  </span>
                </label>
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Admin accounts can add device data
                </span>
              </label>
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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </motion.button>
        </form>

          <div className="divider text-base-content/60">OR</div>

        <div className="text-center">
            <p className="text-base-content/70">
            Already have an account?{' '}
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="link link-primary font-semibold hover:link-primary/80"
              onClick={() => navigate('/login')}
            >
              Login
              </motion.button>
          </p>
        </div>
      </div>
      </motion.div>
    </motion.div>
  )
}

export default Signup 