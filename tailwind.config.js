/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

export const content = [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    keyframes: {
      wiggle: {
        "0%, 100%": { transform: "rotate(-1deg)" },
        "50%": { transform: "rotate(1deg)" },
      },
    },
    animation: {
      wiggle: "wiggle 1s ease-in-out infinite",
    },
  },
};
export const plugins = [nextui()];
