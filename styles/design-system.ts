/**
 * ChartAI — Design System
 * Inspired by thecryptopulse.xyz aesthetic.
 *
 * Single source of truth for all visual tokens.
 * These values are mirrored into globals.css (@theme + :root).
 * Import this file anywhere you need raw token values in TypeScript.
 */

// ─────────────────────────────────────────────────────────────
// COLOR PALETTE
// ─────────────────────────────────────────────────────────────

export const colors = {

  // ── Backgrounds ──────────────────────────────────────────
  bg: {
    /** Page root — deep navy-black */
    base:     '#080B10',
    /** Default card surface */
    surface:  '#0D1117',
    /** Elevated card / popover */
    elevated: '#131922',
    /** Overlay / modal backdrop */
    overlay:  '#1A2332',
    /** Subtle section separator */
    subtle:   '#0A0E15',
  },

  // ── Primary accent — CryptoPulse electric green ───────────
  green: {
    DEFAULT:  '#00FF88',
    bright:   '#00FF88',
    soft:     '#00E57A',
    /** Hover / active state */
    vivid:    '#1AFFA0',
    /** Glow shadow */
    glow:     'rgba(0,255,136,0.30)',
    /** Large area tints */
    dim:      'rgba(0,255,136,0.07)',
    /** Card / input borders */
    border:   'rgba(0,255,136,0.18)',
    /** Subtle ring on focus */
    ring:     'rgba(0,255,136,0.40)',
  },

  // ── Secondary accent — electric blue ─────────────────────
  blue: {
    DEFAULT:  '#00D4FF',
    bright:   '#22E5FF',
    glow:     'rgba(0,212,255,0.28)',
    dim:      'rgba(0,212,255,0.07)',
    border:   'rgba(0,212,255,0.18)',
  },

  // ── Signal / status colors ────────────────────────────────
  bullish:   '#00FF88',
  bearish:   '#FF3B5C',
  neutral:   '#FFB800',

  bullishDim:  'rgba(0,255,136,0.10)',
  bearishDim:  'rgba(255,59,92,0.10)',
  neutralDim:  'rgba(255,184,0,0.10)',

  bullishBorder: 'rgba(0,255,136,0.25)',
  bearishBorder: 'rgba(255,59,92,0.25)',
  neutralBorder: 'rgba(255,184,0,0.25)',

  // ── Text hierarchy ────────────────────────────────────────
  text: {
    /** Main readable copy */
    primary:   '#E8EDF5',
    /** Supporting labels */
    secondary: 'rgba(232,237,245,0.60)',
    /** Placeholder / helper */
    muted:     'rgba(232,237,245,0.38)',
    /** Ultra-low-contrast decorative */
    dim:       'rgba(232,237,245,0.20)',
  },

  // ── Surfaces (opacity layers over bg.base) ────────────────
  surface: {
    '0': 'rgba(255,255,255,0.012)',
    '1': 'rgba(255,255,255,0.028)',
    '2': 'rgba(255,255,255,0.050)',
    '3': 'rgba(255,255,255,0.080)',
    '4': 'rgba(255,255,255,0.110)',
  },

  // ── Borders ───────────────────────────────────────────────
  border: {
    '0': 'rgba(255,255,255,0.038)',
    '1': 'rgba(255,255,255,0.065)',
    '2': 'rgba(255,255,255,0.100)',
    '3': 'rgba(255,255,255,0.150)',
  },
} as const


// ─────────────────────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────────────────────

export const typography = {
  fonts: {
    /** Headings and UI labels — sharp, geometric */
    display: "'Syne', 'Inter', sans-serif",
    /** Body copy */
    body:    "'DM Sans', 'Inter', sans-serif",
    /** All numbers, prices, percentages, data values */
    mono:    "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  },

  sizes: {
    /** Hero heading — fluid clamp */
    hero:   'clamp(2.8rem, 7vw, 5.5rem)',
    /** Section heading */
    h1:     'clamp(2rem, 4vw, 3rem)',
    h2:     'clamp(1.5rem, 3vw, 2rem)',
    h3:     '1.25rem',
    /** Large data metrics */
    metric: '2.25rem',
    /** Medium metrics */
    data:   '1.5rem',
    base:   '1rem',
    sm:     '0.875rem',
    xs:     '0.75rem',
    '2xs':  '0.6875rem',
  },

  weights: {
    regular:   400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },

  lineHeights: {
    tight:   1.15,
    snug:    1.35,
    normal:  1.55,
    relaxed: 1.75,
  },

  letterSpacing: {
    tight:  '-0.02em',
    normal: '0em',
    wide:   '0.04em',
    wider:  '0.08em',
    caps:   '0.12em',
  },
} as const


// ─────────────────────────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────────────────────────

export const spacing = {
  /** 4px base unit */
  unit: 4,
  px:   '1px',
  0:    '0px',
  0.5:  '2px',
  1:    '4px',
  1.5:  '6px',
  2:    '8px',
  2.5:  '10px',
  3:    '12px',
  3.5:  '14px',
  4:    '16px',
  5:    '20px',
  6:    '24px',
  7:    '28px',
  8:    '32px',
  9:    '36px',
  10:   '40px',
  12:   '48px',
  14:   '56px',
  16:   '64px',
  20:   '80px',
  24:   '96px',
  32:   '128px',
} as const


// ─────────────────────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────────────────────

export const radii = {
  none: '0px',
  sm:   '6px',
  md:   '10px',
  lg:   '14px',
  xl:   '18px',
  '2xl':'24px',
  '3xl':'32px',
  full: '9999px',
} as const


// ─────────────────────────────────────────────────────────────
// SHADOWS / GLOWS
// ─────────────────────────────────────────────────────────────

export const shadows = {
  /** Subtle card lift */
  card:    '0 2px 12px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset',
  /** Card hover elevation */
  cardHover: '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,255,136,0.08)',
  /** Primary button glow */
  greenGlow: '0 0 0 1px rgba(0,255,136,0.22), 0 4px 20px rgba(0,255,136,0.20), 0 8px 40px rgba(0,255,136,0.10)',
  /** Primary button hover glow */
  greenGlowHover: '0 0 0 1px rgba(0,255,136,0.38), 0 6px 28px rgba(0,255,136,0.30), 0 12px 56px rgba(0,255,136,0.14)',
  /** Blue data highlight */
  blueGlow: '0 0 0 1px rgba(0,212,255,0.20), 0 4px 20px rgba(0,212,255,0.16)',
  /** Scan line beam */
  scanBeam: '0 0 16px rgba(0,255,136,1), 0 0 36px rgba(0,255,136,0.5)',
  /** Modal / overlay backdrop */
  modal:   '0 24px 80px rgba(0,0,0,0.70)',
} as const


// ─────────────────────────────────────────────────────────────
// ANIMATION VALUES
// ─────────────────────────────────────────────────────────────

export const animation = {
  // Durations (ms)
  duration: {
    instant:  100,
    fast:     150,
    normal:   250,
    moderate: 400,
    slow:     600,
    crawl:    1000,
  },

  // Easing curves
  easing: {
    /** Default spring-like feel */
    spring:  'cubic-bezier(0.22, 1, 0.36, 1)',
    /** Snappy in, smooth out */
    out:     'cubic-bezier(0.0, 0.0, 0.2, 1)',
    /** Standard */
    inOut:   'cubic-bezier(0.4, 0, 0.2, 1)',
    /** Bounce */
    bounce:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
    linear:  'linear',
  },

  // Named animation presets (maps to keyframes in globals.css)
  presets: {
    fadeUp:      'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
    fadeIn:      'fadeIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
    scaleIn:     'scaleIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
    slideLeft:   'slideLeft 0.5s cubic-bezier(0.22,1,0.36,1) both',
    scan:        'scan 1.8s ease-in-out infinite',
    blink:       'blink 1.8s ease-in-out infinite',
    pulseRing:   'pulse-ring 2.4s ease-out infinite',
    ticker:      'ticker 35s linear infinite',
    float:       'float 3.5s ease-in-out infinite',
    spinSlow:    'spin-slow 8s linear infinite',
    orbDrift:    'orb-drift 12s ease-in-out infinite',
    shimmer:     'shimmer 3s linear infinite',
    priceFlash:  'price-flash 2s ease-in-out infinite',
  },

  // Stagger delays for list animations
  stagger: {
    xs:  '0.04s',
    sm:  '0.08s',
    md:  '0.12s',
    lg:  '0.16s',
  },
} as const


// ─────────────────────────────────────────────────────────────
// GLASSMORPHISM PRESETS
// ─────────────────────────────────────────────────────────────

export const glass = {
  /** Standard dark glass card */
  card: {
    background:    'rgba(13,17,23,0.70)',
    border:        'rgba(255,255,255,0.065)',
    backdropFilter:'blur(16px) saturate(160%)',
  },
  /** Premium elevated glass */
  premium: {
    background:    'linear-gradient(135deg, rgba(255,255,255,0.042) 0%, rgba(255,255,255,0.012) 100%)',
    border:        'rgba(255,255,255,0.09)',
    backdropFilter:'blur(24px) saturate(200%)',
  },
  /** Navbar / sticky header */
  nav: {
    background:    'rgba(8,11,16,0.88)',
    border:        'rgba(255,255,255,0.048)',
    backdropFilter:'blur(20px)',
  },
} as const


// ─────────────────────────────────────────────────────────────
// BADGE / STATUS TOKENS
// ─────────────────────────────────────────────────────────────

export const badges = {
  bullish: {
    color:      '#00FF88',
    background: 'rgba(0,255,136,0.10)',
    border:     'rgba(0,255,136,0.25)',
  },
  bearish: {
    color:      '#FF3B5C',
    background: 'rgba(255,59,92,0.10)',
    border:     'rgba(255,59,92,0.25)',
  },
  neutral: {
    color:      '#FFB800',
    background: 'rgba(255,184,0,0.10)',
    border:     'rgba(255,184,0,0.25)',
  },
  free: {
    color:      'rgba(232,237,245,0.45)',
    background: 'rgba(255,255,255,0.04)',
    border:     'rgba(255,255,255,0.08)',
  },
  pro: {
    color:      '#00FF88',
    background: 'rgba(0,255,136,0.08)',
    border:     'rgba(0,255,136,0.20)',
  },
  trader: {
    color:      '#a78bfa',
    background: 'rgba(139,92,246,0.08)',
    border:     'rgba(139,92,246,0.20)',
  },
} as const


// ─────────────────────────────────────────────────────────────
// GRADIENT PRESETS
// ─────────────────────────────────────────────────────────────

export const gradients = {
  /** Hero heading gradient */
  heroText:    'linear-gradient(135deg, #00FF88 0%, #00D4FF 100%)',
  /** Alternate heading gradient */
  greenText:   'linear-gradient(135deg, #1AFFA0 0%, #00FF88 60%, #00CC6E 100%)',
  /** Button fill */
  greenButton: 'linear-gradient(135deg, #00FF88 0%, #00E57A 100%)',
  /** Card top accent line */
  accentLine:  'linear-gradient(90deg, transparent, rgba(0,255,136,0.5), transparent)',
  /** Ambient page glow (hero section) */
  heroGlow:    'radial-gradient(ellipse at top, rgba(0,255,136,0.05) 0%, transparent 60%)',
  /** Divider line */
  divider:     'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent 100%)',
  /** Green divider */
  dividerGreen:'linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.15) 30%, rgba(0,255,136,0.15) 70%, transparent 100%)',
  /** Scan beam */
  scanBeam:    'linear-gradient(90deg, transparent 0%, #00FF88 40%, #1AFFA0 50%, #00FF88 60%, transparent 100%)',
} as const
