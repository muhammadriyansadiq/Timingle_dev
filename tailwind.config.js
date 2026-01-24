/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#a26cf7',
        background: '#f4f4f4',
        secondary: '#f9ebd4',
        text: '#000000',
        whitecolor: '#ffffff',
        admindashboardcolor: "#f9ebd4",
        buttonbgcolor: '#f0b100'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
