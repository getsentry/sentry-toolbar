/* eslint-disable filename-export/match-default-export */
// const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
const tailwind_config = {
  content: ['./index.html', './src/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [import('tailwindcss-animate'), import('tailwindcss-react-aria-components')],
};

export default tailwind_config;
