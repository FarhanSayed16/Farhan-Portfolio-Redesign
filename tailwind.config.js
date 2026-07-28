/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
        pixel: ['var(--font-pixel)'],
      },
      colors: {
        os: {
          bg: 'var(--os-bg)',
          taskbar: 'var(--os-taskbar)',
          window: 'var(--os-window)',
          'window-body': 'var(--os-window-body)',
          'title-active': 'var(--os-title-active)',
          'title-inactive': 'var(--os-title-inactive)',
          border: 'var(--os-border)',
          button: 'var(--os-button)',
          'button-hover': 'var(--os-button-hover)',
        },
        nokia: {
          green: 'var(--nokia-green)',
          body: 'var(--nokia-body)',
          screen: 'var(--nokia-screen)',
        },
        cyan: 'var(--cyan)',
        violet: 'var(--violet)',
        gold: 'var(--gold)',
      },
      keyframes: {
        scanlines: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 4px' },
        },
        typewriter: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        'blink-cursor': {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'var(--cyan)' },
        },
        'nokia-glow': {
          '0%, 100%': { boxShadow: '0 0 8px var(--nokia-green)' },
          '50%': { boxShadow: '0 0 16px var(--nokia-green), 0 0 32px rgba(67, 217, 124, 0.2)' },
        },
        'wallpaper-pan': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'scale-out': {
          from: { opacity: '1', transform: 'scale(1)' },
          to: { opacity: '0', transform: 'scale(0.95)' },
        },
      },
      animation: {
        scanlines: 'scanlines 0.1s steps(1) infinite',
        typewriter: 'typewriter 2s steps(30) forwards',
        'blink-cursor': 'blink-cursor 1s step-end infinite',
        'nokia-glow': 'nokia-glow 3s ease-in-out infinite',
        'wallpaper-pan': 'wallpaper-pan 120s linear infinite alternate',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.15s ease-in',
      },
    },
  },
  plugins: [],
};
