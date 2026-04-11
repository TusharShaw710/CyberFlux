/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cyber: ['Orbitron', 'sans-serif']
      },
      colors: {
        'emerald': {
          '400': '#34d399',
        },
        'pink': {
          '500': '#ec4899',
          '400': '#f472b6',
        },
        'gray': {
          '900': '#111827',
          '800': '#1f2937',
          '700': '#374151',
          '600': '#4b5563',
          '400': '#9ca3af',
          '100': '#f3f4f6',
        },
        'neon': {
          'mint': '#00FFC2',
          'pink': '#FF00E5',
          'blue': '#3D5AFE',
        },
        'dark': {
          'base': '#0D0D12',
        },
      },
      spacing: {
        '8': '2rem',
      },
      boxShadow: {
        'glow-mint': '0 0 20px rgba(0, 255, 194, 0.5)',
        'glow-pink': '0 0 20px rgba(255, 0, 229, 0.5)',
        'glow-blue': '0 0 20px rgba(61, 90, 254, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('tailwindcss/plugin')(function({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
        },
        '.scrollbar-track-transparent': {
          scrollbarTrackColor: 'transparent',
        },
        '.scrollbar-thumb-white/10': {
          scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent',
        },
      })
    }),
  ],
}

