/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── DocuSign-inspired purple theme ───────────────────────
        background: '#F7F5FF',
        surface: '#FFFFFF',
        'surface-2': '#F0EBFF',
        'surface-3': '#E5DCFF',
        border: '#DDD6F5',
        'border-2': '#C4B8EF',
        // ── Brand purple (DocuSign primary) ──────────────────────
        primary: {
          DEFAULT: '#4C00FF',
          hover: '#3D00CC',
          light: '#7B3FFF',
          dark: '#2E0099',
        },
        // ── Semantic ─────────────────────────────────────────────
        success: '#0D7A52',
        warning: '#B45309',
        danger: '#C81933',
        // ── Typography ───────────────────────────────────────────
        'text-primary': '#130032',
        'text-secondary': '#4A3272',
        'text-muted': '#8B7AAE',
        // ── Sidebar (deep purple) ─────────────────────────────────
        'sidebar-bg': '#1A0050',
        'sidebar-border': '#2D0080',
        'sidebar-text': '#B8A0E0',
        'sidebar-text-active': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(76,0,255,0.08), 0 0 0 1px rgba(76,0,255,0.05)',
        'card-hover': '0 4px 16px rgba(76,0,255,0.12), 0 0 0 1px rgba(76,0,255,0.08)',
        'card-md': '0 2px 8px rgba(76,0,255,0.10)',
        focus: '0 0 0 3px rgba(76,0,255,0.20)',
        glow: '0 0 24px rgba(76,0,255,0.18)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
