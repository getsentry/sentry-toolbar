// const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [import('tailwindcss-animate'), import('tailwindcss-react-aria-components')],
};
