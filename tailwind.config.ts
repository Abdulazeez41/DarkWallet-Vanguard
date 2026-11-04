import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#F8F6F0",       // Warm Creamy Linen Base Background
        panel: "#FFFFFF",      // Crisp Warm White Card
        panel2: "#F3ECE2",     // Soft Warm Oat Sub-Panel / Pill
        line: "#E5DDD0",       // Warm Parchment Structural Border
        ink: "#1A1815",        // Deep Espresso Charcoal Primary Text
        mute: "#665E55",       // Earthy Stone / Legible Secondary Text
        pass: "#1B7340",       // Rich Forest Botanical Green
        warn: "#C27803",       // Warm Golden Honey Amber
        block: "#B91C1C",      // Deep Brick Crimson Alert Red
        enclave: "#C25E2E",    // Warm Cognac / Terracotta Bronze Accent
        brandDark: "#26211E",  // Deep Obsidian Espresso
        paper: "#FDFBF7",      // Receipt Cream
        paperInk: "#1E1E1E",
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glowPass: "0 0 20px rgba(27,115,64,.2)",
        "glow-pass": "0 0 20px rgba(27,115,64,.2)",
        glowWarn: "0 0 20px rgba(194,120,3,.2)",
        "glow-warn": "0 0 20px rgba(194,120,3,.2)",
        glowBlock: "0 0 24px rgba(185,28,28,.2)",
        "glow-block": "0 0 24px rgba(185,28,28,.2)",
        glowEnclave: "0 0 24px rgba(194,94,46,.2)",
        "glow-enclave": "0 0 24px rgba(194,94,46,.2)",
      },
      keyframes: {
        scan: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
        flicker: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".7" } },
        pulseSlow: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".8" } },
      },
      animation: {
        scan: "scan 2.4s linear infinite",
        flicker: "flicker 1.6s ease-in-out infinite",
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
