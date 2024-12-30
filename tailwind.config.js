/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontSize: {
        'responsive': 'calc(1.575rem + 3.9vw)',
      },
      container: {
        center: true, // Center the container
        padding: '1rem', // Add padding for responsiveness
        screens: {
          sm: '100%', // Small devices
          md: '100%', // Medium devices
          lg: '1024px', // Large devices
          xl: '1280px', // Extra-large devices
          '2xl': '1536px', // Default Tailwind setting
          '3xl': '1800px', // Custom breakpoint for larger screens
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
