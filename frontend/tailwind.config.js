/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0B0F19',
          light: '#fafafa',
        },
        card: {
          dark: '#111827',
          light: '#ffffff',
        },
        border: {
          dark: '#1F2937',
          light: '#e4e4e7',
        },
        primary: {
          DEFAULT: '#22C55E',
          dark: '#16a34a',
        },
        secondary: {
          DEFAULT: '#6366f1', // Indigo
          dark: '#4f46e5',
        }
      },
      borderRadius: {
        '2xl': '16px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
