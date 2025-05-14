import { useMemo } from 'react'

interface DeviceData {
  _id: string
  deviceId: string
  temperature: number
  humidity: number
  timestamp: string
}

interface DeviceChartProps {
  data: DeviceData[]
  type: 'temperature' | 'humidity'
}

const DeviceChart: React.FC<DeviceChartProps> = ({ data, type }) => {
  // Sort data by timestamp (oldest to newest)
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }, [data])

  // Get the last 10 entries
  const chartData = useMemo(() => {
    return sortedData.slice(-10)
  }, [sortedData])

  // Calculate min and max values for scale
  const valueKey = type === 'temperature' ? 'temperature' : 'humidity'
  const values = chartData.map(item => item[valueKey])
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = maxValue - minValue
  
  // Buffer the range by 10% to avoid values touching edges
  const scaledMin = Math.max(0, minValue - range * 0.1)
  const scaledMax = maxValue + range * 0.1
  const scaledRange = scaledMax - scaledMin

  // Format timestamps for display
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Get y-position for a data point
  const getYPosition = (value: number): number => {
    // Invert the scale so higher values are at the top
    return 100 - ((value - scaledMin) / scaledRange) * 100
  }

  // Colors based on type
  const color = type === 'temperature' ? 'hsl(0, 100%, 50%)' : 'hsl(210, 100%, 50%)'
  const gradientId = `chart-gradient-${type}`

  return (
    <div className="w-full h-full">
      <div className="w-full h-64 relative bg-base-200 rounded-md overflow-hidden">
        {/* Y axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-base-content/70 py-2 px-1">
          <span>{Math.round(scaledMax * 10) / 10}{type === 'temperature' ? '°C' : '%'}</span>
          <span>{Math.round(((scaledMax + scaledMin) / 2) * 10) / 10}</span>
          <span>{Math.round(scaledMin * 10) / 10}</span>
        </div>

        {/* SVG Chart */}
        <svg 
          className="absolute top-0 right-0 w-[calc(100%-24px)] h-full" 
          viewBox={`0 0 100 100`} 
          preserveAspectRatio="none"
        >
          {/* Gradient fill */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" className="text-base-content/10" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" className="text-base-content/10" strokeWidth="0.5" />
          <line x1="0" y1="100" x2="100" y2="100" stroke="currentColor" className="text-base-content/10" strokeWidth="0.5" />
          
          {/* Chart area with data points */}
          {chartData.length > 1 && (
            <>
              {/* Area under the line */}
              <path
                d={`
                  M 0 100
                  ${chartData.map((item, index) => {
                    const x = (index / (chartData.length - 1)) * 100
                    const y = getYPosition(item[valueKey])
                    return `L ${x} ${y}`
                  }).join(' ')}
                  L 100 100
                  Z
                `}
                fill={`url(#${gradientId})`}
              />

              {/* Chart line */}
              <path
                d={`
                  M 0 ${getYPosition(chartData[0][valueKey])}
                  ${chartData.map((item, index) => {
                    const x = (index / (chartData.length - 1)) * 100
                    const y = getYPosition(item[valueKey])
                    return `L ${x} ${y}`
                  }).join(' ')}
                `}
                fill="none"
                stroke={color}
                strokeWidth="2"
              />

              {/* Data points */}
              {chartData.map((item, index) => {
                const x = (index / (chartData.length - 1)) * 100
                const y = getYPosition(item[valueKey])
                return (
                  <circle 
                    key={item._id}
                    cx={x} 
                    cy={y} 
                    r="2" 
                    fill="white" 
                    stroke={color} 
                    strokeWidth="1"
                  />
                )
              })}
            </>
          )}
        </svg>

        {/* X axis labels */}
        <div className="absolute bottom-0 right-0 w-[calc(100%-24px)] flex justify-between text-xs text-base-content/70 pb-1">
          {chartData.length > 1 && (
            <>
              <span>{formatTime(chartData[0].timestamp)}</span>
              <span>{formatTime(chartData[Math.floor(chartData.length / 2)].timestamp)}</span>
              <span>{formatTime(chartData[chartData.length - 1].timestamp)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeviceChart 