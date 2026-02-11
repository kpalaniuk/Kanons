import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Refined palette - warm ambers + cool blues
        ink: '#0a0a0a',
        paper: '#f8f7f4',
        amber: '#FFBA00',
        peach: '#FFB366',
        cyan: '#22E8E8',
        sky: '#5CB8E8',
        royal: '#0066FF',
        steel: '#7A8F9E',
        muted: '#7A8F9E',
        // Legacy colors mapped to new palette
        sand: '#f8f7f4',
        midnight: '#0a0a0a',
        terracotta: '#FFB366',
        ocean: '#0066FF',
        sunset: '#FFBA00',
        cream: '#f8f7f4',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'cursor-pulse': 'cursorPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        cursorPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
