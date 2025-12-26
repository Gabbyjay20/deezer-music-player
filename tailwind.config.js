/** @type {import('tailwindcss').Config} */
export default {
  // Use class-based dark mode so toggling `document.documentElement.classList` works
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

