/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "main-purple": "#5200FF"
      }
    },
  },
  darkMode: 'media',
  plugins: [
    require('tailwindcss-animated'),
    require('flowbite/plugin'),
  ]
}

