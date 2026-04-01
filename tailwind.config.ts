import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0F172A",
          blue: "#1E293B",
          orange: "#F97316",
          orangeLight: "#FFEDD5",
          light: "#F8FAFC",
          gray: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ['"Outfit"', "sans-serif"],
        arabic: ['"Noto Kufi Arabic"', "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        vibrant:
          "0 20px 25px -5px rgba(249, 115, 22, 0.15), 0 8px 10px -6px rgba(249, 115, 22, 0.1)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - 3rem))" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      maxWidth: {
        content: "1400px",
      },
    },
  },
  plugins: [],
};
export default config;
