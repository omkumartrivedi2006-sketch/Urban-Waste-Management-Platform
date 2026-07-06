/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1B6A45',
          DEFAULT: '#0F5132',
          dark: '#0A3621',
          deep: '#14532D',
        },
        accent: {
          lime: '#22C55E',
          teal: '#06B6D4',
          cyan: '#0891B2',
        },
        neutral: {
          bg: '#FAFAFA',
          card: '#FFFFFF',
          text: '#1F2937',
          muted: '#6B7280',
          dark: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.04)',
        'premium': '0 20px 40px -15px rgba(15, 81, 50, 0.08)',
        'accent-shadow': '0 20px 40px -15px rgba(6, 182, 212, 0.12)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.01)' },
        }
      }
    },
  },
  plugins: [],
}
