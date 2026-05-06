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
        ocean: {
          50: "#e8f4fc",
          100: "#c5e4f5",
          200: "#8fc8e8",
          300: "#52a3d6",
          400: "#2d82bc",
          500: "#1a6a9e",
          600: "#0f4f7a",
          700: "#0c3d5f",
          800: "#0a2f4a",
          900: "#071f32",
          950: "#041525",
        },
        coral: {
          300: "#ffb4a8",
          400: "#ff8f7d",
          500: "#ff6b5c",
          600: "#e84d45",
        },
        mango: {
          300: "#ffe08a",
          400: "#ffd24a",
          500: "#ffc233",
          600: "#e6a800",
        },
        avocado: {
          400: "#9dd49a",
          500: "#6bbf63",
          600: "#4a9f42",
        },
        rice: {
          50: "#fdfbf6",
          100: "#f7f0e4",
          200: "#efe4cc",
        },
        charcoal: {
          700: "#2d3339",
          800: "#1f2429",
          900: "#14181c",
        },
      },
      fontFamily: {
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(7, 31, 50, 0.12)",
        lift: "0 20px 50px -12px rgba(7, 31, 50, 0.25)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 120% 80% at 10% 0%, rgba(255,107,92,0.35), transparent 50%), radial-gradient(ellipse 100% 60% at 90% 10%, rgba(255,194,51,0.3), transparent 45%), radial-gradient(ellipse 80% 50% at 50% 100%, rgba(107,191,99,0.22), transparent 50%), linear-gradient(165deg, #071f32 0%, #0c3d5f 45%, #0a2f4a 100%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 45%, transparent 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
