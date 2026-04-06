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
                            // ── Light-theme base ──────────────────────────────────
                    background:  '#F2F5FB',
                            surface:     '#FFFFFF',
                            'surface-2': '#EEF2FA',
                            'surface-3': '#E3EAF5',
                            border:      '#D8E0EE',
                            'border-2':  '#BCC8E0',

                            // ── Brand blue ────────────────────────────────────────
                            primary: {
                                        DEFAULT: '#1654D9',
                                        hover:   '#1244BB',
                                        light:   '#4A7BEE',
                                        dark:    '#0D3799',
                            },

                            // ── Orange accent — gives LossRun360 its own personality
                            accent: {
                                        DEFAULT: '#E8691A',
                                        hover:   '#D05A0C',
                                        light:   '#F0844A',
                            },

                            // ── Semantic ──────────────────────────────────────────
                            success: '#0D7A52',
                            warning: '#B45309',
                            danger:  '#C81933',

                            // ── Typography ────────────────────────────────────────
                            'text-primary':   '#0D1C38',
                            'text-secondary': '#455270',
                            'text-muted':     '#7D8EA8',

                            // ── Sidebar (stays deep navy) ─────────────────────────
                            'sidebar-bg':          '#0F2558',
                            'sidebar-border':      '#1A3570',
                            'sidebar-text':        '#8FAFD6',
                            'sidebar-text-active': '#FFFFFF',
                  },

                  fontFamily: {
                            sans: ['Inter', 'system-ui', 'sans-serif'],
                            mono: ['JetBrains Mono', 'monospace'],
                  },

                  boxShadow: {
                            card:          '0 1px 3px rgba(14,28,62,0.08), 0 0 0 1px rgba(14,28,62,0.05)',
                            'card-hover':  '0 4px 16px rgba(14,28,62,0.12), 0 0 0 1px rgba(14,28,62,0.07)',
                            'card-md':     '0 2px 8px rgba(14,28,62,0.10)',
                            focus:         '0 0 0 3px rgba(22,84,217,0.20)',
                            glow:          '0 0 24px rgba(22,84,217,0.18)',
                  },

                  backgroundImage: {
                            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                  },

                  animation: {
                            'fade-in':    'fadeIn 0.2s ease-in-out',
                            'slide-in':   'slideIn 0.2s ease-out',
                            'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
                  },

                  keyframes: {
                            fadeIn: {
                                        '0%':   { opacity: '0' },
                                        '100%': { opacity: '1' },
                            },
                            slideIn: {
                                        '0%':   { transform: 'translateY(-8px)', opacity: '0' },
                                        '100%': { transform: 'translateY(0)',    opacity: '1' },
                            },
                  },
          },
    },
    plugins: [],
}
