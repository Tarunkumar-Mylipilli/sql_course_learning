/** @type {import('tailwindcss').Config} */
import './src/design/tokens.ts';

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './index.html',
    './admin.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '0px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        ui: ['var(--font-ui)'],
        code: ['var(--font-code)'],
        sans: ['var(--font-ui)'],
        mono: ['var(--font-code)'],
      },
      colors: {
        canvas: 'var(--color-bg-canvas)',
        surface: 'var(--color-bg-surface)',
        elevated: 'var(--color-bg-elevated)',
        overlay: 'var(--color-bg-overlay)',
        'content-primary': 'var(--color-content-primary)',
        'content-secondary': 'var(--color-content-secondary)',
        'content-muted': 'var(--color-content-muted)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-default': 'var(--color-border-default)',
        'border-strong': 'var(--color-border-strong)',
        accent: {
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
        },
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
      },
      boxShadow: {
        e1: 'var(--elevation-e1)',
        e2: 'var(--elevation-e2)',
        e3: 'var(--elevation-e3)',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.2, 0, 0, 1)',
      },
      transitionDuration: {
        micro: '120ms',
        macro: '300ms',
      },
    },
  },
  plugins: [],
};
