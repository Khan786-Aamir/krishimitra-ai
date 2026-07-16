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
          dark: '#09090b',
          light: '#fafafa',
        },
        card: {
          dark: '#18181b',
          light: '#ffffff',
        },
        border: {
          dark: '#27272a',
          light: '#e4e4e7',
        },
        primary: {
          DEFAULT: '#10b981', // Emerald
          dark: '#059669',
        },
        secondary: {
          DEFAULT: '#6366f1', // Indigo
          dark: '#4f46e5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
