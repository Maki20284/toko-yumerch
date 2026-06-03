/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink:   { 900:'#0f1b2d', 800:'#16263d', 700:'#1f3350', 600:'#2b4159' },
        brand: { 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857' },
        accent:{ 400:'#fb7185',500:'#f43f5e',600:'#e11d48' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: { soft: '0 10px 40px -12px rgba(15,27,45,.18)' },
    },
  },
  plugins: [],
}
