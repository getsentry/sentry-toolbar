/* eslint-disable filename-export/match-default-export */
// const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
const tailwind_config = {
  content: ['./index.html', './src/**/*.tsx'],
  theme: {
    extend: {},

    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      white: {
        fg: 'var(--white)',
        raw: '#fff',
      },
      black: {
        fg: 'var(--black)',
        raw: '#1d1127'
      },

      surface: {
        400: 'var(--surface-400)',
        300: 'var(--surface-300)',
        200: 'var(--surface-200)',
        100: 'var(--surface-100)',
      },
      translucentSurface: {
        200: 'var(--translucent-surface-200)',
        100: 'var(--translucent-surface-100)',
      },
      gray: {
        500: 'var(--gray-500)',
        400: 'var(--gray-400)',
        300: 'var(--gray-300)',
        200: 'var(--gray-200)',
        100: 'var(--gray-100)',
      },
      purple: {
        400: 'var(--purple-400)',
        300: 'var(--purple-300)',
        200: 'var(--purple-200)',
        100: 'var(--purple-100)',
      },
      blue: {
        400: 'var(--blue-400)',
        300: 'var(--blue-300)',
        200: 'var(--blue-200)',
        100: 'var(--blue-100)',
      },
      green: {
        400: 'var(--green-400)',
        300: 'var(--green-300)',
        200: 'var(--green-200)',
        100: 'var(--green-100)',
      },
      yellow: {
        400: 'var(--yellow-400)',
        300: 'var(--yellow-300)',
        200: 'var(--yellow-200)',
        100: 'var(--yellow-100)',
      },
      red: {
        400: 'var(--red-400)',
        300: 'var(--red-300)',
        200: 'var(--red-200)',
        100: 'var(--red-100)',
      },
      pink: {
        400: 'var(--pink-400)',
        300: 'var(--pink-300)',
        200: 'var(--pink-200)',
        100: 'var(--pink-100)',
      },
    }
  },
  plugins: [import('tailwindcss-animate'), import('tailwindcss-react-aria-components')],
};

export default tailwind_config;
