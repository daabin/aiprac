const { twinSemiPreset } = require('twin.semi');
const { withAnimations } = require('animated-tailwindcss');

/** @type {import('tailwindcss').Config} */
module.exports = withAnimations({
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
    },
    extend: {
      strokeWidth: {
        1.5: '1.5px',
      },
    },
  },
  presets: [twinSemiPreset()],
});
