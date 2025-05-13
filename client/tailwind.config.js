/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Add this line
      },
      colors: {
        primary: '#1E3A8A',      // Example primary blue
        secondary: '#3B82F6',    // Example secondary light blue
        accent: '#60A5FA',       // Optional accent
      },
    },
  },
  plugins: [],
}
