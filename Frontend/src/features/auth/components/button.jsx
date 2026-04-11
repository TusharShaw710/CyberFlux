import React from 'react'

export const CyberpunkButton = ({ 
  children, 
  type = 'submit', 
  onClick, 
  className = '',
  disabled = false 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-black font-bold py-3 px-4 rounded transition duration-300 uppercase tracking-widest text-sm mt-8 ${className}`}
      style={{
        backgroundColor: disabled ? '#666666' : '#00FFC2',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = '#00E6B3'
          e.target.style.boxShadow = '0 0 20px #00FFC2'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = '#00FFC2'
          e.target.style.boxShadow = 'none'
        }
      }}
    >
      {children}
    </button>
  )
}

export default CyberpunkButton
