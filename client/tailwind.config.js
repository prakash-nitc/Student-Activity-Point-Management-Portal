/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {fontFamily: {
        // Add this line:
        bebas: ['"Bebas Neue"', 'sans-serif']
        
        // If you were using Poppins, it would look like this:
        // poppins: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}