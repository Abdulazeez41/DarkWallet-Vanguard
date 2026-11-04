import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#FAF7F2",       // Soft Oreo Cream Filling Base
        panel: "#FFFFFF",      // Clean Warm Porcelain Card
        panel2: "#F2ECE2",     // Warm Oat Ash Subsurface / Pill
        line: "#DDD4C7",       // Soft Oreo Ash Crumb Border
        ink: "#221E1C",        // Deep Oreo Cocoa Ash Primary Text
        mute: "#766C63",       // Refined Cocoa Ash Secondary Text
        pass: "#256B44",       // Natural Botanical Forest Green
        warn: "#BD761C",       // Warm Honey Amber
        block: "#B23D3D",      // Warm Cocoa Crimson Alert
        enclave: "#B86A2E",    // Warm Salted Caramel / Cocoa Bronze
        brandDark: "#221E1C",  // Deep Oreo Biscuit Ash
        paper: "#FDFBF7",
        paperInk: "#1E1E1E",
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glowPass: "0 0 20px rgba(37,107,68,.15)",
        "glow-pass": "0 0 20px rgba(37,107,68,.15)",
        glowWarn: "0 0 20px rgba(189,118,28,.15)",
        "glow-warn": "0 0 20px rgba(189,118,28,.15)",
        glowBlock: "0 0 24px rgba(178,61,61,.18)",
        "glow-block": "0 0 24px rgba(178,61,61,.18)",
        glowEnclave: "0 0 24px rgba(184,106,46,.18)",
        "glow-enclave": "0 0 24px rgba(184,106,46,.18)",
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
