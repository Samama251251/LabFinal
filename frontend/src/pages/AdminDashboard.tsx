import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiThermometer, FiDroplet, FiSave, FiLogOut, FiRefreshCw, FiServer, FiList } from 'react-icons/fi'

interface DeviceData {
  _id: string
  deviceId: string
  temperature: number
  humidity: number
  timestamp: string
}

interface AdminDashboardProps {
  setIsAuthenticated: (value: boolean) => void
}

function AdminDashboard({ setIsAuthenticated }: AdminDashboardProps) {
  const [deviceId, setDeviceId] = useState('device001')
  const [temperature, setTemperature] = useState('')
  const [humidity, setHumidity] = useState('')
  const [deviceData, setDeviceData] = useState<DeviceData[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const navigate = useNavigate()

  // Fetch device data initially
  useEffect(() => {
    fetchDeviceData()
  }, [])

  const fetchDeviceData = async () => {
    setDataLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:5000/api/data/latest', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()
      
      if (result.success) {
        setDeviceData(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      console.error('Error fetching device data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setDataLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    // Validate inputs
    if (!deviceId || !temperature || !humidity) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    // Validate that temperature and humidity are numbers
    const tempValue = parseFloat(temperature)
    const humidityValue = parseFloat(humidity)
    
    if (isNaN(tempValue) || isNaN(humidityValue)) {
      setError('Temperature and humidity must be numbers')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:5000/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          deviceId,
          temperature: tempValue,
          humidity: humidityValue
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setSuccess('Device data added successfully')
        // Clear the form
        setTemperature('')
        setHumidity('')
        // Refresh device data
        fetchDeviceData()
      } else {
        throw new Error(result.error || 'Failed to add device data')
      }
    } catch (err) {
      console.error('Error adding device data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear token
    localStorage.removeItem('token')
    // Update authentication state
    setIsAuthenticated(false)
    // Redirect to login
    navigate('/login')
  }

  const handleRefresh = () => {
    fetchDeviceData()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-base-100">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-base-100/80 border-b border-base-300 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">IoT Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="badge badge-secondary">Admin</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-circle btn-ghost"
              onClick={handleRefresh}
              aria-label="Refresh data"
            >
              <FiRefreshCw className="text-primary" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-circle btn-ghost"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <FiLogOut className="text-error" />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-base-100 shadow-xl border border-base-300 lg:col-span-1"
          >
            <div className="card-body">
              <h2 className="card-title text-base-content flex items-center gap-2">
                <FiServer className="text-primary" />
                Add Device Data
              </h2>

              {error && (
                <div className="alert alert-error mt-4">
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="alert alert-success mt-4">
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Device ID</span>
                  </label>
                  <select 
                    className="select select-bordered w-full" 
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    required
                  >
                    <option value="device001">Device 001</option>
                    <option value="device002">Device 002</option>
                    <option value="device003">Device 003</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Temperature (°C)</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Enter temperature"
                      className="input input-bordered w-full"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      required
                    />
                    <span><FiThermometer /></span>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Humidity (%)</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Enter humidity"
                      className="input input-bordered w-full"
                      value={humidity}
                      onChange={(e) => setHumidity(e.target.value)}
                      required
                    />
                    <span><FiDroplet /></span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary w-full mt-6 ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Data'}
                  {!loading && <FiSave className="ml-2" />}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Data Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-base-100 shadow-xl border border-base-300 lg:col-span-2"
          >
            <div className="card-body">
              <h2 className="card-title text-base-content flex items-center gap-2">
                <FiList className="text-primary" />
                Recent Device Data
              </h2>

              {dataLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                  <p className="text-base-content/70">Loading device data...</p>
                </div>
              ) : deviceData.length === 0 ? (
                <div className="alert alert-info">
                  <span>No device data available. Please add some data using the form.</span>
                </div>
              ) : (
                <div className="overflow-x-auto mt-4">
                  <table className="table w-full">
                    <thead className="bg-base-200">
                      <tr>
                        <th className="text-base-content">Device ID</th>
                        <th className="text-base-content">Temperature</th>
                        <th className="text-base-content">Humidity</th>
                        <th className="text-base-content">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deviceData.map((device) => (
                        <tr key={device._id} className="hover:bg-base-200">
                          <td className="text-base-content/80">{device.deviceId}</td>
                          <td className="text-base-content/80">
                            <span className="flex items-center">
                              <FiThermometer className="text-primary mr-2" />
                              {device.temperature}°C
                            </span>
                          </td>
                          <td className="text-base-content/80">
                            <span className="flex items-center">
                              <FiDroplet className="text-info mr-2" />
                              {device.humidity}%
                            </span>
                          </td>
                          <td className="text-base-content/80">{formatDate(device.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard 