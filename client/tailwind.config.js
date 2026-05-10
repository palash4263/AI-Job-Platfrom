/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#aa3bff',
          dark: '#c084fc',
        },
      },
    },
  },
  plugins: [],
}
