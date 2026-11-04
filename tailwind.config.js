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
        void: "#0B0E11",
        graphite: "#1F2428",
        slate: {
          border: "#2D333B",
        },
        ash: {
          muted: "#8B949E",
        },
        signal: {
          pure: "#F0F6FC",
        },
        cyan: {
          hyper: "#34D3D5",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["'JetBrains Mono'", "Consolas", "'Courier New'", "monospace"],
        arabic: ["'IBM Plex Sans Arabic'", "'Segoe UI Arabic'", "'Noto Sans Arabic'", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
      },
      boxShadow: {
        none: "none",
        "cyan-subtle": "0 0 10px -2px rgba(52, 211, 213, 0.3)",
      },
      transitionTimingFunction: {
        step: "steps(2, jump-none)",
        snappy: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulseCyan: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        scanline: "scanline 8s linear infinite",
        "pulse-cyan": "pulseCyan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
