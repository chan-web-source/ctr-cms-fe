/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1020px',
      xl: '1440px',
    },
    extend: {
      fontSize: {
        base: '0.8rem',
        lg: '1.rem',
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      colors: {
        lightBlue: 'hsl(215.02, 98.39%, 51.18%)',
        darkBlue: 'hsl(213.86, 58.82%, 46.67%)',
        lightGreen: 'hsl(156.62, 73.33%, 58.82%)',
      },
      // fontFamily: {
      //   sans: ['Poppins', 'sans-serif'],
      // },
      // spacing: {
      //   180: '32rem',
      // },
    },
  },
  plugins: [],
};
