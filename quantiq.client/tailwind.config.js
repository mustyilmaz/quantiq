// tailwind.config.js
import daisyui from 'daisyui'; // require yerine import kullanın

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        primary: '#667eea',
        secondary: '#5a67d8',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'input-bg': 'var(--input-bg)',
        'input-border': 'var(--input-border)',
        'accent-color': 'var(--accent-color)',
        'accent-hover': 'var(--accent-hover)',
        'border-color': 'var(--border-color)',
      },
      boxShadow: {
        DEFAULT: 'var(--shadow)',
      },
    },
  },
  plugins: [
    daisyui, // require yerine import kullanın
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
}
