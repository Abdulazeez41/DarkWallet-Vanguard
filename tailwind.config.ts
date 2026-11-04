import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#07090D",      // page background
        panel: "#0E131B",     // cards
        panel2: "#141B26",    // raised cards
        line: "#1F2A37",      // borders
        ink: "#E6EDF3",       // main text
        mute: "#8B98A8",      // secondary text
        pass: "#5EEAD4",      // pass / sealed / settled
        warn: "#FBBF24",      // warnings / simulated
        block: "#F43F5E",     // blocked / kill switch
        enclave: "#7C9CFF",   // enclave core glow
        paper: "#FDFBF7",     // receipt only
        paperInk: "#1E1E1E",
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glowPass: "0 0 24px rgba(94,234,212,.35)",
        "glow-pass": "0 0 24px rgba(94,234,212,.35)",
        glowWarn: "0 0 24px rgba(251,191,36,.35)",
        "glow-warn": "0 0 24px rgba(251,191,36,.35)",
        glowBlock: "0 0 24px rgba(244,63,94,.45)",
        "glow-block": "0 0 24px rgba(244,63,94,.45)",
        glowEnclave: "0 0 32px rgba(124,156,255,.4)",
        "glow-enclave": "0 0 32px rgba(124,156,255,.4)",
      },
      keyframes: {
        scan: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
        flicker: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".6" } },
      },
      animation: { scan: "scan 2.4s linear infinite", flicker: "flicker 1.6s ease-in-out infinite" },
    },
  },
  plugins: [],
} satisfies Config;
