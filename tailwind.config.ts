import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom color palette matching home page
                'navy': {
                    900: '#0a0e27',
                    800: '#1a1f3a',
                    700: '#252b4a',
                    600: '#2d3454',
                },
                'cyan': {
                    DEFAULT: '#00d4ff',
                    dark: '#00a8cc',
                    light: '#33ddff',
                },
                'purple': {
                    DEFAULT: '#a855f7',
                    dark: '#8b3fd9',
                    light: '#b97aff',
                },
                'magenta': '#ff00ff',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                'gradient-accent': 'linear-gradient(135deg, #ff00ff 0%, #00d4ff 100%)',
                'gradient-subtle': 'linear-gradient(180deg, rgba(0, 212, 255, 0.1) 0%, transparent 100%)',
                'gradient-glow': 'radial-gradient(circle at center, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
                'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
                'glow-sm': '0 0 10px rgba(0, 212, 255, 0.2)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
export default config;
