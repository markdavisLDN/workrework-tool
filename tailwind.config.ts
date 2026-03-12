import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',
        surface: '#161616',
        border: '#2A2A2A',
        'text-primary': '#F0EDE6',
        'text-secondary': '#9A9590',
        gold: '#C49A3C',
        'gold-hover': '#D4AB50',
        error: '#C0392B',
        success: '#2ECC71',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '720px',
      },
    },
  },
  plugins: [],
}

export default config
