/** @type {import('tailwindcss').Config} */
import animations from '@midudev/tailwind-animations'
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "main-purple": "#5200FF"
      },
      fontFamily: {
        inter: "inter"
      }
    },
  },
  darkMode: 'media',
  plugins: [
    require('tailwindcss-animated'),
    require('flowbite/plugin'),
    animations
  ]
}

