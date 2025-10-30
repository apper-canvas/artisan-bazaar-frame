/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B6F47",
        secondary: "#C4A77D",
        accent: "#D4AF37",
        surface: "#FAF6F1",
        success: "#6B8E23",
        warning: "#E07B39",
        error: "#C44536",
        info: "#5B7C99"
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}