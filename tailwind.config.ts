import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0d14',
        surface: {
          DEFAULT: '#101522',
          light: '#182032',
          lighter: '#222d46',
          border: '#1e293b',
          subtle: '#141b2d',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        cyan: {
          glow: '#06b6d4',
        },
        diff: {
          addBg: 'rgba(16, 185, 129, 0.12)',
          addBorder: 'rgba(16, 185, 129, 0.35)',
          addText: '#34d399',
          delBg: 'rgba(244, 63, 94, 0.12)',
          delBorder: 'rgba(244, 63, 94, 0.35)',
          delText: '#fb7185',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
