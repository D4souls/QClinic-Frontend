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
        "main-purple": "#5200FF",
        "main-bg": "#FAF7FC",
        "dark-main-bg": "#1C2126",
      },
      fontFamily: {
        inter: "inter"
      }
    },
  },
  darkMode: 'class',
  plugins: [
    require('tailwindcss-animated'),
    require('flowbite/plugin'),
    animations
  ]
}

