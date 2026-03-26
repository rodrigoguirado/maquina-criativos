import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sz: {
          blue: '#0055FF',
          navy: '#00143D',
          coral: '#FC6058',
          soft: '#6593FF',
          light: '#E8F0FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config
