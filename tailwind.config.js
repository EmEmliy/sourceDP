/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6200',
        'primary-light': '#FF8C42',
        'primary-dark': '#E04F00',
        secondary: '#1A1A1A',
      },
      maxWidth: {
        '1200': '1200px',
      },
      borderRadius: {
        'sm':  '8px',
        'md':  '12px',
        'lg':  '16px',
        'xl':  '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'xs': '0 1px 3px rgba(0,0,0,0.06)',
        'sm': '0 2px 8px rgba(0,0,0,0.08)',
        'md': '0 4px 16px rgba(0,0,0,0.10)',
        'lg': '0 8px 32px rgba(0,0,0,0.12)',
        'xl': '0 16px 48px rgba(0,0,0,0.14)',
      },
      lineHeight: {
        'tight': '1.3',
        'snug':  '1.45',
        'base':  '1.6',
        'loose': '1.8',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'spring':   'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-out both',
        'slide-up':    'slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in':    'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
        'pulse-soft':  'pulseSoft 2.5s ease-in-out infinite',
        'skeleton':    'skeleton-shine 1.6s ease-in-out infinite',
        'heart-beat':  'heartBeat 0.4s ease',
      },
    },
  },
  plugins: [],
}
