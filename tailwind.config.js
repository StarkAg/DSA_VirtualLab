/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      colors: {
        // Academic palette
        ink: {
          DEFAULT: '#0f172a',
          soft: '#334155',
          mute: '#64748b',
          faint: '#94a3b8',
        },
        accent: {
          DEFAULT: '#2563eb',
          soft: '#3b82f6',
          dark: '#1d4ed8',
        },
        teal: { DEFAULT: '#0d9488', soft: '#14b8a6' },
        surface: {
          DEFAULT: '#ffffff',
          sunken: '#f4f6f8',
          line: 'rgba(15,23,42,0.08)',
        },
        ok: '#16a34a',
        warn: '#d97706',
        bad: '#dc2626',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
        pop: '0 8px 28px rgba(37,99,235,0.18)',
      },
      borderRadius: {
        xl2: '14px',
      },
      backgroundImage: {
        'header-bar': 'linear-gradient(100deg, #334155 0%, #475569 45%, #64748b 100%)',
        'brand': 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.85) translateY(6px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'fade-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        'fade-up': 'fade-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
