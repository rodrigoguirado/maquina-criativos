import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sz: {
          blue: "#0055FF",
          navy: "#00143D",
          coral: "#FC6058",
          "blue-dark": "#0048D7",
          "blue-deep": "#00247A",
          "blue-light": "#6593FF",
          "blue-pale": "#E8EFFE",
          "coral-light": "#FF8882",
          "coral-pale": "#FFCECD",
          "coral-bg": "#FFF6F5",
          text: "#2E2E2E",
          gray: "#7C7C7C",
          green: "#2BBD68",
          yellow: "#FAA200",
        },
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
