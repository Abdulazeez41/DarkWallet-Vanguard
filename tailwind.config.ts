import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#010616",      // Fluence Deep Midnight Base
        panel: "#0B1122",     // Fluence Dark Navy Card
        panel2: "#101931",    // Fluence Raised Slate Card
        line: "#1B2745",      // Calm structural border
        ink: "#FFFFFF",       // Pure white primary text
        mute: "#8F9CAE",      // Calm refined secondary text
        pass: "#00EC97",      // Fluence / NEAR Calm Tech Green
        warn: "#F3A953",      // Fluence Warm Accent Orange
        block: "#F35365",     // Fluence Coral Alert Red
        enclave: "#2D68FF",   // Fluence Primary Brand Blue
        cyanGlow: "#38BDF8",  // Clean Sky/Cyan Accent
        paper: "#FDFBF7",     // receipt only
        paperInk: "#1E1E1E",
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glowPass: "0 0 24px rgba(0,236,151,.35)",
        "glow-pass": "0 0 24px rgba(0,236,151,.35)",
        glowWarn: "0 0 24px rgba(243,169,83,.35)",
        "glow-warn": "0 0 24px rgba(243,169,83,.35)",
        glowBlock: "0 0 28px rgba(243,83,101,.4)",
        "glow-block": "0 0 28px rgba(243,83,101,.4)",
        glowEnclave: "0 0 32px rgba(45,104,255,.35)",
        "glow-enclave": "0 0 32px rgba(45,104,255,.35)",
        glowCyan: "0 0 32px rgba(56,189,248,.35)",
        "glow-cyan": "0 0 32px rgba(56,189,248,.35)",
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
