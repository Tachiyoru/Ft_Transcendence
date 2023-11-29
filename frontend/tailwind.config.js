/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray': '#7F7F7F',
        'purple': '#7610F8',
        'lilac' : '#BF93F7',
        'violet-black' : '#2A025E' ,
        'violet-black-nav': '#160030',
        'dark-violet' : '#460994',
        'accent-violet': '#540CAF',
        'fushia': '#EF1FEA',
        'transparent-violet-black': '#160030',
        'acid-green': '#D8F828',
        'red-orange': '#FF4501',
      },
      fontSize: {
        xs: '0.6rem',
        sm: '0.7rem',
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

