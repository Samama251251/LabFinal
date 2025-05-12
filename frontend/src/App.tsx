import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-4xl font-bold mb-4">Counter</h2>
          <p className="text-6xl font-bold text-primary mb-6">{count}</p>
          <div className="card-actions justify-center gap-4">
            <button 
              className="btn btn-primary btn-lg" 
              onClick={() => setCount(count + 1)}
            >
              Increment
            </button>
            <button 
              className="btn btn-secondary btn-lg" 
              onClick={() => setCount(count - 1)}
            >
              Decrement
            </button>
            <button 
              className="btn btn-accent btn-lg" 
              onClick={() => setCount(0)}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
