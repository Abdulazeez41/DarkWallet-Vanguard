import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0B101D",      // modern vibrant deep cyber-navy (replaces murky black)
        panel: "#121A2D",     // rich luminous slate card
        panel2: "#1A243D",    // elevated vibrant card
        line: "#253450",      // crisp luminous structural borders
        ink: "#FFFFFF",       // pure radiant white text
        mute: "#94A3B8",      // crisp readable cool silver text
        pass: "#00F5A0",      // luminous electric emerald / mint
        warn: "#FBBF24",      // radiant solar gold
        block: "#FF3366",     // vivid laser crimson
        enclave: "#38BDF8",   // vibrant high-energy electric cyan
        cyanGlow: "#00F0FF",  // ultra-bright cyan accent
        purpleGlow: "#A855F7",// vivid violet accent
        paper: "#FDFBF7",     // receipt only
        paperInk: "#1E1E1E",
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glowPass: "0 0 28px rgba(0,245,160,.45)",
        "glow-pass": "0 0 28px rgba(0,245,160,.45)",
        glowWarn: "0 0 28px rgba(251,191,36,.45)",
        "glow-warn": "0 0 28px rgba(251,191,36,.45)",
        glowBlock: "0 0 32px rgba(255,51,102,.55)",
        "glow-block": "0 0 32px rgba(255,51,102,.55)",
        glowEnclave: "0 0 36px rgba(56,189,248,.5)",
        "glow-enclave": "0 0 36px rgba(56,189,248,.5)",
        glowCyan: "0 0 36px rgba(0,240,255,.55)",
        "glow-cyan": "0 0 36px rgba(0,240,255,.55)",
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
