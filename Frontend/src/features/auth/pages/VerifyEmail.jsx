import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const location = useLocation();
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      // If there's no token in URL, maybe they just registered and are waiting
      return; 
    }

    const verifyToken = async () => {
      setStatus('loading');
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/verify-email?token=${token}`
        );
        if (response.data.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error("Verification failed", error);
        setStatus('error');
      }
    };

    verifyToken();
  }, [location.search]);

  // Cyberpunk Component Styles
  const cardStyle = "relative z-10 bg-black/40 backdrop-blur-xl border border-[#00f0ff]/30 p-8 md:p-12 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col items-center text-center max-w-md w-full mx-4 transition-all duration-500";
  const neonTextBlue = "text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0080ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]";
  const neonTextPink = "text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#ff0080] drop-shadow-[0_0_8px_rgba(255,0,255,0.6)]";
  const neonTextGreen = "text-transparent bg-clip-text bg-gradient-to-r from-[#00ff00] to-[#008000] drop-shadow-[0_0_8px_rgba(0,255,0,0.6)]";
  
  const renderContent = () => {
    if (status === 'success') {
      return (
        <div className="flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-[#00ff00] blur-[30px] opacity-20 rounded-full animate-pulse"></div>
            <div className="relative z-10 w-24 h-24 flex items-center justify-center rounded-full border border-[#00ff00]/40 bg-[#00ff00]/10 shadow-[0_0_20px_rgba(0,255,0,0.3)]">
              <svg className="w-12 h-12 text-[#00ff00] drop-shadow-[0_0_15px_rgba(0,255,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className={`text-3xl font-bold mb-4 tracking-wider ${neonTextGreen}`}>
            Email verified successfully ✅
          </h2>
          <p className="text-zinc-400 font-light mb-10 text-sm md:text-base">
            Your connection to the grid has been established.
          </p>
          <Link
            to="/login?verified=true"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 font-semibold tracking-[0.15em] text-white transition-all duration-300 bg-transparent border border-[#00ff00]/70 rounded hover:bg-[#00ff00]/10 hover:shadow-[0_0_25px_rgba(0,255,0,0.4)] overflow-hidden w-full uppercase text-sm"
          >
            <span className="relative z-10">Return to Login</span>
            <div className="absolute inset-0 h-full w-0 bg-[#00ff00]/20 transition-all duration-400 ease-out group-hover:w-full z-0"></div>
          </Link>
        </div>
      );
    }
    
    if (status === 'error') {
      return (
        <div className="flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-[#ff00ff] blur-[30px] opacity-20 rounded-full animate-pulse"></div>
            <div className="relative z-10 w-24 h-24 flex items-center justify-center rounded-full border border-[#ff00ff]/40 bg-[#ff00ff]/10 shadow-[0_0_20px_rgba(255,0,255,0.3)]">
              <svg className="w-12 h-12 text-[#ff00ff] drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 className={`text-3xl font-bold mb-4 tracking-wider ${neonTextPink}`}>
            Verification Failed
          </h2>
          <p className="text-zinc-400 font-light mb-10 text-sm md:text-base">
            Verification link is invalid or expired ❌
          </p>
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 font-semibold tracking-[0.15em] text-white transition-all duration-300 bg-transparent border border-[#ff00ff]/70 rounded hover:bg-[#ff00ff]/10 hover:shadow-[0_0_25px_rgba(255,0,255,0.4)] overflow-hidden w-full uppercase text-sm"
          >
            <span className="relative z-10">Register Again</span>
            <div className="absolute inset-0 h-full w-0 bg-[#ff00ff]/20 transition-all duration-400 ease-out group-hover:w-full z-0"></div>
          </Link>
        </div>
      );
    }

    if (status === 'loading') {
      return (
        <div className="flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
          <div className="mb-10 relative flex justify-center items-center">
            <div className="absolute inset-0 bg-[#00f0ff] blur-[40px] opacity-20 rounded-full animate-pulse"></div>
            
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 rounded-full border border-[#00f0ff]/20 border-t-[#00f0ff] animate-[spin_1.5s_linear_infinite]"></div>
              <div className="absolute inset-2 rounded-full border border-dashed border-[#00f0ff]/40 animate-[spin_2s_linear_infinite_reverse]"></div>
            </div>
          </div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 uppercase tracking-[0.1em] ${neonTextBlue}`}>
            Verifying Token...
          </h2>
        </div>
      );
    }
    
    // Default Null State (Registered and waiting for email)
    return (
      <div className="flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
        <div className="mb-10 relative flex justify-center items-center">
          <div className="absolute inset-0 bg-[#00f0ff] blur-[40px] opacity-20 rounded-full animate-pulse"></div>
          
          <div className="relative w-28 h-28">
            {/* Cyberpunk Radar/Scanner ring */}
            <div className="absolute inset-0 rounded-full border border-[#00f0ff]/20 border-t-[#00f0ff] animate-[spin_2s_linear_infinite]"></div>
            <div className="absolute inset-2 rounded-full border border-dashed border-[#00f0ff]/40 animate-[spin_3s_linear_infinite_reverse]"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <h2 className={`text-2xl md:text-3xl font-bold mb-4 uppercase tracking-[0.1em] ${neonTextBlue}`}>
          Verify Your Email
        </h2>
        
        <p className="text-zinc-300 font-light mb-8 leading-relaxed max-w-sm text-[15px]">
          An email has been sent successfully to your email address. Please click the link inside to proceed.
        </p>
        
        <div className="flex items-center justify-center space-x-3 text-[#00f0ff]/80 text-xs font-mono uppercase tracking-widest border border-[#00f0ff]/20 bg-[#00f0ff]/5 px-4 py-2 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping shadow-[0_0_8px_#00f0ff]"></span>
          <span>Awaiting confirmation...</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden font-sans selection:bg-[#00f0ff]/30 selection:text-white">
      
      {/* Background Cyberpunk Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft generic glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00f0ff] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.07] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ff00ff] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.05] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
        
        {/* Futuristic Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
        
        {/* Horizontal scanline decorative element */}
        <div className="absolute left-0 right-0 h-[1px] top-1/3 bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent"></div>
      </div>

      <div className={cardStyle}>
        {/* Decorative Sci-Fi UI corner accents */}
        <div className="absolute top-[-1px] left-[-1px] w-6 h-6 border-t-[3px] border-l-[3px] border-[#00f0ff] rounded-tl-xl opacity-70"></div>
        <div className="absolute top-[-1px] right-[-1px] w-6 h-6 border-t-[3px] border-r-[3px] border-[#00f0ff] rounded-tr-xl opacity-70"></div>
        <div className="absolute bottom-[-1px] left-[-1px] w-6 h-6 border-b-[3px] border-l-[3px] border-[#00f0ff] rounded-bl-xl opacity-70"></div>
        <div className="absolute bottom-[-1px] right-[-1px] w-6 h-6 border-b-[3px] border-r-[3px] border-[#00f0ff] rounded-br-xl opacity-70"></div>

        {renderContent()}
      </div>

      {/* Global CSS animation definitions */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
