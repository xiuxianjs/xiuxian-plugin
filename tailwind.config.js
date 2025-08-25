/**
 *  @type {import('tailwindcss').Config}
 */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './views/**/*.{html,js,json}'],
  // safelist removed to avoid warnings for custom classes
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#47ada8',
          accent: '#d3bc8e',
          dark: '#1d3940'
        }
      },
      boxShadow: {
        card: '0 5px 10px 0 rgba(0,0,0,0.15)'
      }
    }
  }
};
