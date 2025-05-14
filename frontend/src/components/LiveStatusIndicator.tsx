import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LiveStatusIndicatorProps {
  lastUpdated: string
}

const LiveStatusIndicator: React.FC<LiveStatusIndicatorProps> = ({ lastUpdated }) => {
  const [secondsAgo, setSecondsAgo] = useState<number>(0)
  const [status, setStatus] = useState<'live' | 'recent' | 'stale'>('live')

  useEffect(() => {
    // Calculate and update the seconds ago
    const calculateTimeDiff = () => {
      const lastUpdate = new Date(lastUpdated).getTime()
      const now = new Date().getTime()
      const diffInSeconds = Math.round((now - lastUpdate) / 1000)
      setSecondsAgo(diffInSeconds)

      // Set status based on time difference
      if (diffInSeconds < 10) {
        setStatus('live')
      } else if (diffInSeconds < 60) {
        setStatus('recent')
      } else {
        setStatus('stale')
      }
    }

    // Initial calculation
    calculateTimeDiff()

    // Update every second
    const interval = setInterval(calculateTimeDiff, 1000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  // Format time ago for display
  const formatTimeAgo = () => {
    if (secondsAgo < 60) {
      return `${secondsAgo}s ago`
    } else if (secondsAgo < 3600) {
      return `${Math.floor(secondsAgo / 60)}m ago`
    } else {
      return `${Math.floor(secondsAgo / 3600)}h ago`
    }
  }

  return (
    <div className="flex items-center gap-2">
      <motion.div 
        className={`h-2 w-2 rounded-full ${
          status === 'live' ? 'bg-success' : 
          status === 'recent' ? 'bg-warning' : 
          'bg-error'
        }`}
        animate={{
          scale: status === 'live' ? [1, 1.2, 1] : 1
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop'
        }}
      />
      <span className="text-xs text-base-content/70">
        {status === 'live' ? 'Live' : formatTimeAgo()}
      </span>
    </div>
  )
}

export default LiveStatusIndicator 