/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  // Avoid resetting Material / existing global styles (see src/styles.scss).
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        // Match --app-font-family / Figma UI text (Manrope only in index.html).
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        // Theme tokens from src/app/styles/theme (_theming.scss)
        secondary: 'var(--color-secondary)',
        'surface-container-low': 'var(--color-surface-container-low)',
      },
    },
  },
  plugins: [],
};
