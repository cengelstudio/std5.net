/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'std5': {
          primary: 'var(--std5-primary)',
          'primary-dark': 'var(--std5-primary-dark)',
          'primary-light': 'var(--std5-primary-light)',
          accent: 'var(--std5-accent)',
          dark: 'var(--std5-dark)',
          darker: 'var(--std5-darker)',
        },
        admin: {
          bg: '#ffffff',
          text: '#000000',
          muted: '#666666',
          border: 'rgba(0, 0, 0, 0.1)',
        }
      },
    },
  },
  plugins: [],
}
