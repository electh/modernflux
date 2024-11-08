// tailwind.config.js
/* eslint-env node */
/* global module:readonly */
// eslint-disable-next-line no-undef
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};
