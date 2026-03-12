import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ---- Fuentes del design system ---- */
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        sans:    ["var(--font-ibm-plex-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-ibm-plex-mono)", "monospace"],
      },
      /* ---- Colores del design system ---- */
      colors: {
        bg:           "#F8F7F4",
        surface:      "#FFFFFF",
        "surface-alt":"#F0EDE8",
        metal: {
          light: "#D6D7D9",
          DEFAULT: "#A8AAAE",
          dark:  "#6B6D72",
        },
        accent:        "#111111",
        "accent-hover":"#2C2C2C",
        /* shadcn/ui tokens */
        background:    "hsl(var(--background))",
        foreground:    "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border:  "hsl(var(--border))",
        input:   "hsl(var(--input))",
        ring:    "hsl(var(--ring))",
      },
      /* ---- Radios del design system (máximo 6px) ---- */
      borderRadius: {
        none:    "0px",
        sm:      "2px",
        DEFAULT: "4px",
        lg:      "6px",
        /* deshabilitamos valores grandes */
        xl:      "6px",
        "2xl":   "6px",
        full:    "6px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
