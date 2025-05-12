import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiMail, FiUser } from 'react-icons/fi'

interface SignupProps {
  setIsAuthenticated: (value: boolean) => void
  setUserRole: (role: 'admin' | 'user') => void
}

function Signup({ setIsAuthenticated, setUserRole }: SignupProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        throw new Error('Signup failed')
      }

      const data = await response.json()
      setIsAuthenticated(true)
      setUserRole(data.role)
      navigate(data.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      console.error('Signup error:', err)
      setError('Failed to create account. Please try again.')
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
            <FiUser className="text-white text-3xl" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-base-content mb-1 tracking-tight">Sign Up</h2>
          <p className="text-base-content/60">Create your account to get started</p>
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
              <span className="label-text text-base font-medium">Full Name</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                placeholder="Enter your full name"
                className="input input-bordered pl-10 w-full focus:input-primary transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
                placeholder="Create a password"
                className="input input-bordered pl-10 w-full focus:input-primary transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-base font-medium">Confirm Password</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="password"
                placeholder="Confirm your password"
                className="input input-bordered pl-10 w-full focus:input-primary transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
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
            {isLoading ? 'Creating Account...' : 'Sign Up'}
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
            Already have an account?{' '}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="link link-primary font-semibold"
              onClick={() => navigate('/login')}
            >
              Login
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Signup 