import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1B3A6B",
          secondary: "#2E75B6",
          accent: "#E8962E",
          success: "#1A7A4A",
          light: "#D6E4F4",
          background: "#F4F6F9"
        },
        primary:    "#1B3A6B",
        secondary:  "#2E75B6",
        accent:     "#E8962E",
        success:    "#1A7A4A",
        light:      "#D6E4F4",
        background: "#F4F6F9",
      }
    },
  },
  plugins: [],
};
export default config;
