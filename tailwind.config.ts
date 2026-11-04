import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#FAF7F0',
          300: '#F5EBE1',
          400: '#EAD7C5',
        },
        pastel: {
          mint: '#B8E3D2',
          mintLight: '#D4F0E4',
          yellow: '#FEF3C7',
          yellowBright: '#FDE047',
          tan: '#EAD7C5',
          tanLight: '#F5EBE1',
        },
        charcoal: {
          900: '#1E1E1E',
          800: '#2A2A2A',
          700: '#404040',
        },
        alarm: {
          redTanBg: '#FCE8E6',
          redTanBorder: '#E06A55',
          redTanText: '#991B1B',
        },
      },
      boxShadow: {
        neo: '4px 4px 0px 0px #1E1E1E',
        'neo-sm': '2px 2px 0px 0px #1E1E1E',
        'neo-lg': '6px 6px 0px 0px #1E1E1E',
      },
      fontFamily: {
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        'travel-line': {
          '0%': { transform: 'translateX(-10%)' },
          '50%': { transform: 'translateX(300%)' },
          '100%': { transform: 'translateX(650%)' },
        },
        'redact-lock': {
          '0%': { opacity: '0.2', transform: 'scaleY(0.4)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        'travel-line': 'travel-line 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'redact-lock': 'redact-lock 0.15s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
