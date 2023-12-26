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
        'filter': '#160030'
      },
      fontSize: {
        xs: '0.6rem',
        sm: '0.7rem',
        base: '0.8rem',
        xl: '1.20rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '3.7rem',
        '5xl': '5.3rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        audiowide: ['Audiowide', 'sans-serif'],
        kanit: ['Kanit', 'sans-serif'],
      },
      fontWeight: {
        'extrabold': 800,
      },
      boxShadow: {
        'inner-custom': 'inset 0 -40px 30px rgba(0, 0, 0, 0.6), 0 3px 6px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

