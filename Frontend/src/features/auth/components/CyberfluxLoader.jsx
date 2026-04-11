import React from 'react';

const CyberfluxLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050510] overflow-hidden relative font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes glitch-anim {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
        }
        .glitch-text::before, .glitch-text::after {
          content: 'Cyberflux';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }
        .glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 #ff00ff;
          animation: glitch-anim 3s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          left: -2px;
          text-shadow: -1px 0 #00ffff;
          animation: glitch-anim 2.5s infinite linear alternate-reverse;
        }
      `}} />

      {/* Global Background ambient glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center mt-[-10vh]">
        
        {/* Core rings container */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* Outer diffuse glow ring */}
          <div className="absolute w-full h-full border border-cyan-500/20 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.2)] animate-[spin_10s_linear_infinite]"></div>

          {/* Outer glowing segmented ring */}
          <div className="absolute w-56 h-56 border-y-4 border-x-4 border-t-cyan-400 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-[spin_3s_linear_infinite] shadow-[0_0_15px_rgba(34,211,238,0.4)] mix-blend-screen"></div>
          
          {/* Middle counter-rotating tech ring */}
          <div className="absolute w-44 h-44 border-4 border-r-blue-500 border-b-transparent border-l-cyan-300 border-t-transparent border-dashed rounded-full animate-[spin_4s_linear_infinite_reverse] shadow-[0_0_10px_rgba(59,130,246,0.6)] opacity-80"></div>
          
          {/* Inner fast ring */}
          <div className="absolute w-32 h-32 border-2 border-t-purple-400 border-x-transparent border-b-cyan-200 rounded-full animate-[spin_1.5s_cubic-bezier(0.68,-0.55,0.26,1.55)_infinite] shadow-[0_0_20px_rgba(192,132,252,0.6)]"></div>

          {/* Pulsating core background */}
          <div className="absolute w-12 h-12 bg-cyan-400/20 rounded-full blur-md animate-[pulse_1s_ease-in-out_infinite]"></div>
          
          {/* Pulsating core center */}
          <div className="absolute w-6 h-6 bg-cyan-300 rounded-full shadow-[0_0_30px_15px_rgba(34,211,238,0.7)] animate-[pulse_2s_ease-in-out_infinite]"></div>
          
          {/* Center tiny energy dot */}
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_5px_rgba(255,255,255,0.9)]"></div>

          {/* Orbital floating particles */}
          <div className="absolute w-full h-full animate-[spin_5s_linear_infinite]">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,1)] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)] -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>

        {/* Text Area */}
        <div className="mt-16 text-center space-y-4">
          <h1 className="relative text-4xl font-black tracking-[0.4em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 glitch-text drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            Cyberflux
          </h1>
          
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-cyan-500/50"></span>
            <p className="text-cyan-400/90 font-mono text-sm tracking-[0.3em] uppercase max-w-min whitespace-nowrap overflow-hidden border-r-2 border-cyan-400 animate-[pulse_1s_infinite]">
              Initializing AI
            </p>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-cyan-500/50"></span>
          </div>

          {/* Minimal progress bar */}
          <div className="w-64 h-1.5 bg-gray-900/80 rounded-full mt-6 mx-auto overflow-hidden relative border border-gray-800">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-[0_0_10px_rgba(34,211,238,0.8)] w-full -translate-x-full animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      {/* Cybernetic Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none"></div>

      {/* Full screen vertical scanning beam */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/20 shadow-[0_0_15px_2px_rgba(34,211,238,0.3)] pointer-events-none z-20" style={{ animation: 'scan 4s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}></div>
      
      {/* HUD Edge Brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-purple-500/30 rounded-bl-lg"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-purple-500/30 rounded-br-lg"></div>
    </div>
  );
};

export default CyberfluxLoader;
