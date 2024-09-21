/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F8F9FA', 
        },
        secondary1: {
          DEFAULT: '#E8AA9B',
        },
        secondary2: {
          DEFAULT: '#789ABF',
        },
        secondary3: {
          DEFAULT: '#9BC1EE',
        },
        secondary4: {
          DEFAULT: '#BBDEF1',
        },
        accent1: {
          DEFAULT: '#E56E44',
        },
        accent2: {
          DEFAULT: '#1A385A',
        },
      },
      textColor: {
        'green': 'text-green-600', // Custom class 'greee'
      },
    },
  },
  plugins: [],
}
