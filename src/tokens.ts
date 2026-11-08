// Design System Tokens - Single Source of Truth
// Pure semantic tokens, scale definitions, and type guards

export const typography = {
  fonts: {
    ui: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    code: '"JetBrains Mono", Consolas, Monaco, "Courier New", monospace',
  },
  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.7',
  },
} as const;

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
  48: '192px',
  64: '256px',
} as const;

export const radius = {
  none: '0px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
} as const;

export const elevation = {
  e1: 'var(--elevation-e1)', // subtle border / low rise
  e2: 'var(--elevation-e2)', // soft floating card
  e3: 'var(--elevation-e3)', // modal / popover
} as const;

export const motion = {
  durations: {
    micro: '120ms',
    default: '200ms',
    macro: '300ms',
  },
  easing: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type ThemeMode = 'light' | 'dark' | 'system';
