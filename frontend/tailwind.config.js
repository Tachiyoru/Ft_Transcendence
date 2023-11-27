/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'param': '#94A2AB',
        'medium-purple': '#7610F8',
        'light-purple' : '#BF93F7',
        'dark-purple' : '#2A025E' ,
        'purple-hoover' : '#460994',
        'purple-unhoover': '#540DAF',
        'pink': '#EF1FEA',
      },
      fontSize: {
        xs: '0.6rem',
        sm: '0.8rem',
        base: '1rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      }
    },
  },
  plugins: [],
}

