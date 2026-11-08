/** @type {import('tailwindcss').Config} */
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
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        overlay: 'var(--bg-overlay)',

        border: {
          subtle: 'var(--border-subtle)',
          default: 'var(--border-default)',
          strong: 'var(--border-strong)',
        },

        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
        },

        accent: {
          50: 'var(--accent-50)',
          100: 'var(--accent-100)',
          200: 'var(--accent-200)',
          300: 'var(--accent-300)',
          400: 'var(--accent-400)',
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
          700: 'var(--accent-700)',
          800: 'var(--accent-800)',
          900: 'var(--accent-900)',
          950: 'var(--accent-950)',
          fg: 'var(--accent-fg)',
        },

        feedback: {
          'success-bg': 'var(--success-bg)',
          'success-border': 'var(--success-border)',
          'success-fg': 'var(--success-fg)',
          'warning-bg': 'var(--warning-bg)',
          'warning-border': 'var(--warning-border)',
          'warning-fg': 'var(--warning-fg)',
          'error-bg': 'var(--error-bg)',
          'error-border': 'var(--error-border)',
          'error-fg': 'var(--error-fg)',
          'info-bg': 'var(--info-bg)',
          'info-border': 'var(--info-border)',
          'info-fg': 'var(--info-fg)',
        },
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
