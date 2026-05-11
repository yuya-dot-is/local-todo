import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          0: '#0f0f1a',
          1: '#161625',
          2: '#1e1e30',
          3: '#252538',
        },
        accent: {
          DEFAULT: '#7c6af5',
          hover: '#9585f8',
          muted: 'rgba(124,106,245,0.15)',
        },
        glass: 'rgba(255,255,255,0.06)',
      },
      backdropBlur: {
        glass: '16px',
      },
      boxShadow: {
        glass: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        card: '0 8px 32px rgba(0,0,0,0.5)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
