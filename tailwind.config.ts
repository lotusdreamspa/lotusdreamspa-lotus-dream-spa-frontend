import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#163300",
        secondary: "#FFC091",
        'lotus-blue': '#355070',
        "lotus-dark-blue": "#1f3a5c",
        'lotus-lavander': '#7552A0',
        'lotus-bronze': '#eaac8b',
        'lotus-rosewood': '#b56576',
        'lotus-light-gold': '#FFC091',
        "lotus-gold": "#d8975d",
      },
      fontFamily: {
        agr: ["Agr", "serif"],
        ret: ["Ret", "sans-serif"],
      }
    },
    screens: {
      xm: { max: "400px" },
      sm: { min: "401px", max: "768px" },
      md: { min: "769px", max: "1024px" },
      lg: { min: "1025px", max: "1490px" },
      xl: { min: "1491px" },
    }
  },
  plugins: [],
};
export default config;
