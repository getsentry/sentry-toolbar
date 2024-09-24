/* eslint-disable filename-export/match-default-export */
// const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
const tailwind_config = {
  content: ['./index.html', './src/**/*.tsx'],
  theme: {
    extend: {
      zIndex: {
        initial: 1,
        debug: 9999,
      },

      icon: {
        up: 'rotate(0deg)',
        right: 'rotate(90deg)',
        down: 'rotate(180deg)',
        left: 'rotate(270deg)',
      },

      fontFamily: {
        sans: ['Rubik', 'Avenir Next', 'sans-serif'],
        mono: ['Roboto Mono', 'Monaco', 'Consolas', 'Courier New', 'monospace']
      },

      font: {
        xs: '11px',
        sm: '12px',
        md: '14px',
        lg: '16px',
        xl: '18px',
        xxl: '18px',
      },

      spacing: {
        0: 0,
        0.25: '2px',
        0.5: '4px',
        0.75: '6px',
        1: '8px',
        1.5: '12px',
        2: '16px',
        3: '20px',
        4: '30px',
        100: '100%',
      },
    },

    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      white: {
        DEFAULT: 'var(--white)',
        raw: '#fff',
      },
      black: {
        DEFAULT: 'var(--black)',
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

      shadow: {
        light:  'var(--shadow-light)',
        medium: 'var(--shadow-medium)',
        heavy: 'var(--shadow-heavy)',
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

      sentryPurple: 'var(--sentry-purple)',

      alpha: {
        bg: `linear-gradient(90deg, var(--pink-300), var(--yellow-300))`,
        indicatorColor: 'var(--pink-300)',
        fg: '#fff',
      },
      beta: {
        bg: `linear-gradient(90deg, var(--purple-300), var(--pink-300))`,
        indicatorColor: 'var(--purple-300)',
        fg: '#fff',
      },
      new: {
        bg: `linear-gradient(90deg, var(--blue-300), var(--green-300))`,
        indicatorColor: 'var(--green-300)',
        fg: '#fff',
      },
    },
  },
  plugins: [import('tailwindcss-animate'), import('tailwindcss-react-aria-components')],
};

export default tailwind_config;
