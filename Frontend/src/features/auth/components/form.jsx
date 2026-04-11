import React, { useState } from 'react'
import { Lock, User, Mail, Eye, EyeOff } from 'lucide-react'
import { CyberpunkButton } from './button'

export const DynamicForm = ({ 
  fields = [], 
  onSubmit, 
  buttonText = 'Submit',
  heading = 'Form',
  subtitle = 'Please fill in the details',
  toggleLink = null,
}) => {
  // Initialize form data based on fields parameter
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = field.type === 'password' ? '' : ''
      return acc
    }, {})
  )

  // State for password visibility
  const [showPassword, setShowPassword] = useState({})

  // Two-way binding: handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData);
  }

  // Toggle password visibility
  const togglePasswordVisibility = (fieldName) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  // Get icon based on field name
  const getIcon = (fieldName) => {
    switch (fieldName.toLowerCase()) {
      case 'username':
        return <User size={14} style={{ color: '#00FFC2' }} />
      case 'email':
        return <Mail size={14} style={{ color: '#00FFC2' }} />
      case 'password':
        return <Lock size={14} style={{ color: '#00FFC2' }} />
      default:
        return null
    }
  }

  // Input focus & blur handlers
  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#00FFC2'
    e.target.style.boxShadow = '0 0 15px rgba(0, 255, 194, 0.3)'
  }

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#374151'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="bg-[#121214] border border-gray-800 rounded-lg p-8 shadow-[0_0_30px_rgba(0,255,194,0.1)]">
        
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-2 tracking-wider">
          {heading}
        </h1>

        {/* Subtitle */}
        <p className="text-center text-sm text-gray-400 mb-8 tracking-wide">
          {subtitle}
        </p>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Render fields dynamically */}
          {fields.map((field) => (
            <div key={field.name} className="relative">
              <label htmlFor={field.name} className="block text-xs font-semibold uppercase tracking-widest text-gray-300 mb-3">
                <span className="inline-flex items-center gap-2">
                  {getIcon(field.name)}
                  {field.label}
                </span>
              </label>

              {field.type === 'password' ? (
                <div className="relative">
                  <input
                    type={showPassword[field.name] ? 'text' : 'password'}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder || '••••••••'}
                    required={field.required !== false}
                    className="w-full bg-black/50 border-b border-gray-700 px-2 py-3 pr-10 text-white placeholder-gray-600 transition duration-300 focus:border-b-2 focus:outline-none"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field.name)}
                    className="absolute right-3 bottom-3 text-gray-400 hover:transition hover:duration-300"
                    style={{ color: '#00FFC2' }}
                  >
                    {showPassword[field.name] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              ) : (
                <input
                  type={field.type || 'text'}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required !== false}
                  className="w-full bg-black/50 border-b border-gray-700 px-2 py-3 text-white placeholder-gray-600 transition duration-300 focus:border-b-2 focus:outline-none"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              )}
            </div>
          ))}

          {/* Submit Button */}
          <CyberpunkButton>
            {buttonText}
          </CyberpunkButton>
        </form>

        {/* Toggle View Link */}
        {toggleLink && (
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
          </div>
        )}
        {toggleLink && (
          <div className="text-center text-sm">
            <p className="text-gray-400">
              {toggleLink.text} {' '}
              {toggleLink.linkComponent}
            </p>
          </div>
        )}

        
      </div>
    </div>
  )
}

export default DynamicForm
