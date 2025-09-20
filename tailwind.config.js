/** @type {import('tailwindcss').Config} */
const flowbitePlugin = require('flowbite/plugin');

const cvar = (name) => `var(${name})`;

module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "100%",
        md: "100%",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      /* Token-driven colors (from globals.css :root & data-country) */
      colors: {
        /* Primary brand = BLUE (now the default) */
        brand: {
          700: cvar("--brand-700"),
          600: cvar("--brand-600"),
          500: cvar("--brand-500"),
          400: cvar("--brand-400"),
          300: cvar("--brand-300"),
          200: cvar("--brand-200"),
          100: cvar("--brand-100"),
          50:  cvar("--brand-50"),
          DEFAULT: cvar("--brand-600"),
          /* legacy aliases (kept for back-compat) */
          dark: "#821CD2",
          light: "#EBD9FC",
        },

        /* Neutral tokens */
        ink: { DEFAULT: cvar("--ink"), 2: cvar("--ink-2") },
        line: cvar("--line"),
        surface: cvar("--surface"),
        "alt-surface": cvar("--alt-surface"),

        /* Status tokens */
        success: cvar("--success"),
        warning: cvar("--warning"),
        danger: cvar("--danger"),
        info: cvar("--info"),
        commerce: { 600: cvar("--commerce-600") },

        /* Country accent (stays dynamic via [data-country]) */
        accent: {
          DEFAULT: cvar("--accent"),
          100: cvar("--accent-100"),
        },

        /* NEW: Violet/Purple support scale (for chips/badges/visited, etc) */
        violet: {
          800: cvar("--violet-800"),
          700: cvar("--violet-700"),
          600: cvar("--violet-600"),
          550: cvar("--violet-550"),
          500: cvar("--violet-500"),
          400: cvar("--violet-400"),
          300: cvar("--violet-300"),
          200: cvar("--violet-200"),
          100: cvar("--violet-100"),
          50:  cvar("--violet-50"),
          DEFAULT: cvar("--violet-600"),
        },

        /* Keep your convenience grays */
        gray: { soft: "#f3f4f6", softer: "#F1F3F4" },

        /* Back-compat names */
        background: cvar("--surface"),
        foreground: cvar("--ink"),
      },

      boxShadow: {
        upfrica:
          "0 1px 2px rgba(60,64,67,0.30), 0 1px 3px 1px rgba(60,64,67,0.15)",
        card: "0 2px 8px rgba(0,0,0,0.05)",
        elevated: "0 6px 30px rgba(17,12,46,0.06)",
      },

      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },

      fontSize: {
        responsive: "calc(1.575rem + 3.9vw)",
      },

      /* Micro-motion for hero chips, trust pills, and ticker */
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-2px)" },
          "40%": { transform: "translateX(2px)" },
          "60%": { transform: "translateX(-2px)" },
          "80%": { transform: "translateX(2px)" },
        },
        pulseRed: {
          "0%,100%": { backgroundColor: "#fee2e2" },
          "50%": { backgroundColor: "#fecaca" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        blob: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(10px,-8px) scale(1.05)" },
          "66%": { transform: "translate(-6px,6px) scale(0.98)" },
          "100%": { transform: "translate(0,0) scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp .6s ease-out",
        fadeIn: "fadeIn .3s ease-in-out",
        shake: "shake .6s ease-in-out infinite",
        pulseRed: "pulseRed 1.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        blob: "blob 12s ease-in-out infinite",
        marquee: "marquee 18s linear infinite", // for the top ticker
      },

      /* Default ring picks up brand color (nice for inputs/buttons) */
      ringColor: {
        DEFAULT: cvar("--brand-600"),
      },
    },
  },
  plugins: [
    flowbitePlugin,
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};