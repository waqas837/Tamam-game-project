/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    // other plugins...
  ],
  theme: {
    extend: {
      // Add custom scrollbar styles here
      scrollbar: {
        DEFAULT: {
          thumbColor: 'rgba(107, 114, 128, 0.5)', // Tailwind color "gray-600" with 50% opacity
          trackColor: 'rgba(229, 231, 235, 0.3)', // Tailwind color "gray-200" with 30% opacity
          width: '8px',
        },
      },
    },
  },
}