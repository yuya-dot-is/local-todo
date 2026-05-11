import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        logo: ['Pacifico', 'cursive'],
      },
      colors: {
        surface: {
          0: '#f0f4f8',
          1: '#ffffff',
          2: '#f8fafc',
          3: '#e8edf3',
        },
        accent: {
          DEFAULT: '#16a34a',
          hover: '#15803d',
          muted: 'rgba(22,163,74,0.10)',
        },
        ink: {
          DEFAULT: '#1a2332',
          muted: '#64748b',
          faint: '#94a3b8',
        },
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        glass: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        card: '0 2px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        tab: '0 -2px 12px rgba(0,0,0,0.06)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
