import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#f9f8f7',
          card: 'rgba(255, 255, 255, 0.7)',
        },
        accent: {
          bronze: '#bfa47a',
        },
        text: {
          primary: '#1b1b1b',
          secondary: 'rgba(27, 27, 27, 0.7)',
        },
        border: {
          primary: 'rgba(0, 0, 0, 0.08)',
        },
        shadow: {
          soft: 'rgba(0, 0, 0, 0.05)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'display-1': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'display-2': ['40px', { lineHeight: '1.1', fontWeight: '700' }],
        'header-lg': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'header-md': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'subheader-lg': ['22px', { lineHeight: '1.4', fontWeight: '600' }],
        'subheader-md': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.5px' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-bronze': 'pulse-bronze 2s ease-in-out infinite',
        'spin': 'spin 1.5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-bronze': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(191, 164, 122, 0.3)' },
          '50%': { boxShadow: '0 0 0 10px rgba(191, 164, 122, 0)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'soft': '0 5px 15px rgba(0, 0, 0, 0.05)',
        'bronze-glow': '0 0 15px rgba(191, 164, 122, 0.3)',
        'bronze-glow-large': '0 0 30px rgba(191, 164, 122, 0.4)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '96': '24rem',
        '128': '32rem',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
export default config;