/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Brand & UI palette
        brand: {
          DEFAULT: '#A435F0',     // main purple
          dark: '#821CD2',        // darker purple for hover/focus
          light: '#EBD9FC',       // soft tint for backgrounds/icons
        },
        gray: {
          soft: '#f3f4f6',        // upfricaGray1
          softer: '#F1F3F4',      // upfricaGray2
        },
        background: 'var(--background)',   // system themes
        foreground: 'var(--foreground)',
      },

      boxShadow: {
        upfrica: '0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        card: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },

      fontSize: {
        responsive: 'calc(1.575rem + 3.9vw)',
      },

      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '100%',
          md: '100%',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },

      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out',
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
    },
  },

  plugins: [
    require('flowbite/plugin'),
  ],
};