/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    extend: {
      colors: {
        "main-purple": "#5200FF"
      }
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ]
}

