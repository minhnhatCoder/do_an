/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', "Arial", "sans-serif"],
      },
      colors: {
        "primary-blue500": "#233F80",
      },
    },
  },
  plugins: [],
};
