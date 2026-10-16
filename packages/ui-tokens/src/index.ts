/**
 * ==============================================================================
 * FresherToWork Design System — Core Design Tokens & System Specifications
 * Visual Personality: Premium, Warm, Young, Confident, Professional, Minimal, Modern
 * ==============================================================================
 */
export const PALETTE = {
  // Official Brand Palette: #1f357c (Navy), #3e7aa7 (Ocean), #4ad1c7 (Teal)
  brand: {
    50: '#edfbf9',
    100: '#d5f7f4',
    200: '#aef0e9',
    300: '#65ded5',
    400: '#4ad1c7', // Vibrant Teal Accent
    500: '#3e7aa7', // Ocean Blue Midtone
    600: '#1f357c', // Deep Royal Navy Primary
    700: '#192c67',
    800: '#142251',
    900: '#0c1633',
    950: '#070d1f',
  },
  navy: '#1f357c',
  ocean: '#3e7aa7',
  teal: '#4ad1c7',

  // Recruiter Indigo (Analytical, Authoritative, Executive)
  accent: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },

  // Warm Neutral Palette (Balanced Slate-Zinc blend, avoiding sterile harsh grays)
  neutral: {
    0: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Semantic Status Colors
  success: {
    50: '#f0f7fb',
    100: '#dcedf6',
    500: '#3e7aa7',
    700: '#1f357c',
    text: '#1f357c',
    bg: '#f0f7fb',
    border: '#b5caf3',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    700: '#b45309',
    text: '#92400e',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    700: '#b91c1c',
    text: '#991b1b',
    bg: '#fef2f2',
    border: '#fecaca',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    700: '#1d4ed8',
    text: '#1e40af',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
};

export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'Plus Jakarta Sans, Inter, sans-serif',
    mono: 'JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    '2xs': { size: '10px', lineHeight: '14px', letterSpacing: '0.02em' },
    xs: { size: '12px', lineHeight: '16px', letterSpacing: '0.01em' },
    sm: { size: '14px', lineHeight: '20px', letterSpacing: '0em' },
    base: { size: '16px', lineHeight: '24px', letterSpacing: '-0.01em' },
    lg: { size: '18px', lineHeight: '28px', letterSpacing: '-0.015em' },
    xl: { size: '20px', lineHeight: '28px', letterSpacing: '-0.02em' },
    '2xl': { size: '24px', lineHeight: '32px', letterSpacing: '-0.025em' },
    '3xl': { size: '30px', lineHeight: '38px', letterSpacing: '-0.03em' },
    '4xl': { size: '36px', lineHeight: '44px', letterSpacing: '-0.035em' },
    '5xl': { size: '48px', lineHeight: '56px', letterSpacing: '-0.04em' },
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
};

export const SPACING = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

export const RADIUS = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
};

export const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(15 23 42 / 0.04)',
  sm: '0 1px 3px 0 rgb(15 23 42 / 0.07), 0 1px 2px -1px rgb(15 23 42 / 0.05)',
  md: '0 4px 6px -1px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.05)',
  lg: '0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.04)',
  xl: '0 20px 25px -5px rgb(15 23 42 / 0.08), 0 8px 10px -6px rgb(15 23 42 / 0.04)',
  card: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.04)',
  cardHover: '0 10px 20px -5px rgb(15 23 42 / 0.08), 0 4px 8px -4px rgb(15 23 42 / 0.04)',
  focusRing: '0 0 0 3px rgba(62, 122, 167, 0.25)',
  dropdown: '0 12px 28px -4px rgb(15 23 42 / 0.12), 0 4px 10px -2px rgb(15 23 42 / 0.06)',
};

export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

// Aliases for compatibility
export const COLORS = PALETTE;
export const BORDER_RADIUS = RADIUS;
