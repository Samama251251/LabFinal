import { useState, useEffect } from 'react'
import { FiFilter, FiCheck } from 'react-icons/fi'

interface DeviceData {
  _id: string
  deviceId: string
  temperature: number
  humidity: number
  timestamp: string
}

interface DeviceFilterProps {
  data: DeviceData[]
  onFilterChange: (deviceId: string | null) => void
}

const DeviceFilter: React.FC<DeviceFilterProps> = ({ data, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [devices, setDevices] = useState<string[]>([])

  // Extract unique device IDs from data
  useEffect(() => {
    const uniqueDevices = Array.from(new Set(data.map(item => item.deviceId)))
    setDevices(uniqueDevices)
  }, [data])

  const handleSelectDevice = (deviceId: string | null) => {
    setSelectedDevice(deviceId)
    onFilterChange(deviceId)
    setIsOpen(false)
  }

  return (
    <div className="dropdown dropdown-end">
      <button 
        className={`btn btn-sm ${selectedDevice ? 'btn-primary' : 'btn-ghost'} flex items-center gap-2`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiFilter className="w-4 h-4" />
        <span>
          {selectedDevice ? `Device: ${selectedDevice}` : 'All Devices'}
        </span>
      </button>
      
      {isOpen && (
        <div className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-1">
          <ul className="menu menu-compact">
            <li key="all">
              <button 
                className={`flex items-center justify-between ${selectedDevice === null ? 'bg-base-200' : ''}`}
                onClick={() => handleSelectDevice(null)}
              >
                <span>All Devices</span>
                {selectedDevice === null && <FiCheck className="text-primary" />}
              </button>
            </li>
            {devices.map(deviceId => (
              <li key={deviceId}>
                <button 
                  className={`flex items-center justify-between ${selectedDevice === deviceId ? 'bg-base-200' : ''}`}
                  onClick={() => handleSelectDevice(deviceId)}
                >
                  <span>{deviceId}</span>
                  {selectedDevice === deviceId && <FiCheck className="text-primary" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DeviceFilter 