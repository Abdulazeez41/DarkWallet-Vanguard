import type { Config } from "tailwindcss";

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "rgb(var(--void-rgb) / <alpha-value>)",
        panel: "rgb(var(--panel-rgb) / <alpha-value>)",
        panel2: "rgb(var(--panel2-rgb) / <alpha-value>)",
        line: "rgb(var(--line-rgb) / <alpha-value>)",
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        mute: "rgb(var(--mute-rgb) / <alpha-value>)",
        pass: "rgb(var(--pass-rgb) / <alpha-value>)",
        warn: "rgb(var(--warn-rgb) / <alpha-value>)",
        block: "rgb(var(--block-rgb) / <alpha-value>)",
        enclave: "rgb(var(--enclave-rgb) / <alpha-value>)",
        brandDark: "rgb(var(--brand-dark-rgb) / <alpha-value>)",
        paper: "#FDFBF7",
        paperInk: "#1E1E1E",
        sceneBg: "rgb(var(--scene-bg-rgb) / <alpha-value>)",
        sceneBox: "rgb(var(--scene-box-rgb) / <alpha-value>)",
        sceneBorder: "rgb(var(--scene-border-rgb) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glowPass: "0 0 24px rgba(0, 236, 151, 0.25)",
        "glow-pass": "0 0 24px rgba(0, 236, 151, 0.25)",
        glowWarn: "0 0 24px rgba(251, 191, 36, 0.25)",
        "glow-warn": "0 0 24px rgba(251, 191, 36, 0.25)",
        glowBlock: "0 0 24px rgba(244, 63, 94, 0.25)",
        "glow-block": "0 0 24px rgba(244, 63, 94, 0.25)",
        glowEnclave: "0 0 24px rgba(124, 156, 255, 0.25)",
        "glow-enclave": "0 0 24px rgba(124, 156, 255, 0.25)",
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
