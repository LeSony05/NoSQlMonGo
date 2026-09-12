import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17202A',
        mist: '#F5F7FA',
        teal: '#0F766E',
        coral: '#E76F51'
      }
    }
  },
  plugins: []
};

export default config;
