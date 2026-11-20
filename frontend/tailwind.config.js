/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a9f7',
          500: '#0e8de9',
          600: '#0270c8',
          700: '#0359a2',
          800: '#074c85',
          900: '#0c406e',
          950: '#082949',
        },
        avoxell: {
          blue: '#1e40af',
          accent: '#2563eb',
          light: '#f1f7fe',
          card: '#f8fbff',
          border: '#e2e8f0',
          dark: '#0f172a',
          muted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(37, 99, 235, 0.08)',
        'blue-glow': '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}
