import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { DynamicForm } from '../components/form'
import {useAuth} from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CyberfluxLoader from '../components/CyberfluxLoader';

const registerFields = [
  {
    name: 'username',
    label: 'Alias',
    type: 'text',
    placeholder: 'username_alpha',
    required: true,
  },
  {
    name: 'email',
    label: 'Identity Tag',
    type: 'email',
    placeholder: 'you@example.com',
    required: true,
  },
  {
    name: 'password',
    label: 'Security Key',
    type: 'password',
    placeholder: '••••••••',
    required: true,
  },
]

export const Register = () => {
  const { handleRegister } = useAuth();
  const navigate=useNavigate();
  const loading=useSelector((state)=>state.auth.loading);
  const [localError, setLocalError] = useState('');

  const handleRegisterSubmit = async (formData) => {
    setLocalError('');
    const result = await handleRegister(formData);
    
    // Check if result returned true (success) or an object with success/error
    if(result === true || result?.success === true){
      navigate("/verify-email");
    } else if (result?.error) {
      setLocalError(result.error);
    }
  };

  if(loading){
    return <CyberfluxLoader />;
  }

  return (
    <div className="flex h-screen w-full relative overflow-hidden"
         style={{
           background: '#121212',
           backgroundImage: `
             radial-gradient(circle at 20% 50%, rgba(0, 255, 194, 0.15) 0%, transparent 50%),
             radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
             radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.08) 0%, transparent 40%)
           `
         }}>
      
      {/* Cyberpunk Grid Effect - Full Screen */}
      <div className="absolute inset-0 opacity-[0.02]"
           style={{
             backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 194, 0.05) 25%, rgba(0, 255, 194, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 194, 0.05) 75%, rgba(0, 255, 194, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 194, 0.05) 25%, rgba(0, 255, 194, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 194, 0.05) 75%, rgba(0, 255, 194, 0.05) 76%, transparent 77%, transparent)',
             backgroundSize: '50px 50px'
           }}></div>

      {/* Left Panel - CyberFlux Branding */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-8 relative z-10">
        {/* Content */}
        <div className="text-center max-w-md">

          {/* Main Heading */}
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00FFC2] via-[#FF00E5] to-[#3D5AFE] bg-clip-text text-transparent">
            CyberFlux
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-base tracking-wide">
            Synthesizing chaos into <span className="text-[#00FFC2]">intelligence</span> ⚡
          </p>

          {/* Decorative Lines */}
          <div className="mt-12 space-y-2">
            <div className="h-px bg-gradient-to-r from-transparent via-[#00FFC2] to-transparent opacity-30"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Component */}
      <div className="w-full lg:flex-1 h-screen flex items-center justify-center px-4 py-8 relative z-10">
        {/* Form Component */}
        <DynamicForm
          fields={registerFields}
          onSubmit={handleRegisterSubmit}
          buttonText="Initialize"
          error={localError}
          onErrorClear={() => setLocalError('')}
          heading={
            <>
             <span style={{color:"#FFFFFF"}}>ESTABLISH</span> <span style={{ color: '#00FFC2' }}>Node</span>
            </>
          }
          subtitle="Create your secure credentials."
          toggleLink={{
            text: "Already on the grid?",
            linkComponent: (
              <Link 
                to="/login" 
                className="transition duration-300 font-semibold hover:opacity-80"
                style={{ color: '#FF00E5' }}
              >
                Access System
              </Link>
            ),
          }}
        />
      </div>
    </div>
  )
}
