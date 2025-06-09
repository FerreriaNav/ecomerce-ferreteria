// components/Alert.tsx
import React from 'react'

type AlertProps = {
  message: string
  type: 'error' | 'success' | 'info' | 'warning'
  onClose: () => void
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const alertClass = {
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black',
  }[type]

  return (
    <div className={`p-4 mb-4 rounded-lg ${alertClass} flex justify-between items-center`}>
      <div className="flex items-center">
        <span className="font-semibold">{message}</span>
      </div>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default Alert
