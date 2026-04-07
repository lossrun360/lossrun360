/** @type {import('tailwindcss').Config} */
// Colors mirror the CSS variables in globals.css :root exactly.
// If you update a token there, update it here too.
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── DocuSign brand purples ────────────────────────────────────
        primary: {
          DEFAULT: '#4c00ff',   // --ds-purple-brand
          hover:   '#3d1eb2',   // --ds-purple-mid
          light:   '#7b3fff',
          dark:    '#2e0099',
        },
        // ── Page & surface backgrounds ────────────────────────────────
        background: '#f7f7fb',   // --ds-page-bg  (very faint purple tint)
        surface:    '#ffffff',   // --ds-white
        'surface-2': 'rgba(19,0,50,0.04)',   // subtle hover / section bg
        'surface-3': 'rgba(19,0,50,0.07)',

        // ── Borders ───────────────────────────────────────────────────
        border:    'rgba(19,0,50,0.15)',  // --ds-border
        'border-2': 'rgba(19,0,50,0.3)', // --ds-border-strong

        // ── Typography ────────────────────────────────────────────────
        'text-primary':   '#130032',              // --ds-text-primary
        'text-secondary': 'rgba(19,0,50,0.75)',   // --ds-text-muted
        'text-muted':     'rgba(19,0,50,0.5)',    // --ds-text-subtle
        'text-faint':     'rgba(19,0,50,0.35)',   // --ds-text-faint

        // ── Semantic ──────────────────────────────────────────────────
        success: '#059669',
        warning: '#d97706',
        danger:  '#dc2626',

        // ── Legacy sidebar tokens (kept for any remaining usages) ─────
        'sidebar-bg':          '#ffffff',
        'sidebar-border':      'rgba(19,0,50,0.15)',
        'sidebar-text':        'rgba(19,0,50,0.6)',
        'sidebar-text-active': '#4c00ff',
      },

      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        // DocuSign type scale
        'ds-label': ['11px', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '500' }],
        'ds-body':  ['14px', { lineHeight: '1.5' }],
        'ds-sm':    ['13px', { lineHeight: '1.5' }],
        'ds-lg':    ['15px', { lineHeight: '1.4' }],
      },

      borderRadius: {
        sm: '4px',   // --ds-radius-sm
        md: '8px',   // --ds-radius-md
        lg: '12px',  // --ds-radius-lg
        DEFAULT: '8px',
      },

      boxShadow: {
        card:   '0 1px 3px rgba(19,0,50,0.08), 0 4px 16px rgba(19,0,50,0.06)',   // --ds-shadow-card
        raised: '0 2px 8px rgba(19,0,50,0.12), 0 8px 24px rgba(19,0,50,0.08)',   // --ds-shadow-raised
        focus:  '0 0 0 3px rgba(76,0,255,0.12)',
      },

      backgroundImage: {
        // DocuSign hero gradient — exactly as extracted from docusign.com
        'ds-hero': 'radial-gradient(100% 100% at 50% 0%, #4c00ff 0%, #26065d 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },

      transitionDuration: {
        DEFAULT: '150ms',
      },

      animation: {
        'fade-in':   'fadeIn 0.15s ease',
        'slide-in':  'slideIn 0.15s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateY(-6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
