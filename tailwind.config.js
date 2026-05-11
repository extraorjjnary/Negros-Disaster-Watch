/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        base: '#0a0f1e',
        panel: '#0f1629',
        card: '#131d35',
        hover: '#1a2540',
        // Borders
        border: '#1e3060',
        'border-light': '#2a4070',
        // Blues
        primary: '#1e40af',
        mid: '#2563eb',
        bright: '#3b82f6',
        // Status
        danger: '#dc2626',
        warning: '#ea580c',
        caution: '#d97706',
        safe: '#16a34a',
        // Text
        ink: '#e8eeff',
        muted: '#8ba0c8',
        faint: '#4a6090',
      },
      fontFamily: {
        sans: ['Barlow', 'system-ui', 'sans-serif'],
        cond: ['Barlow Condensed', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
