/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#F8F9FA',
					100: '#FFFFFF', // Lighter
					200: '#F1F3F5',
					300: '#E8EBED',
					500: '#DFE2E4' // Darker
				},
				secondary1: {
					DEFAULT: '#E8AA9B',
					100: '#FDEBE9', // Lighter
					500: '#D0846E' // Darker
				},
				secondary2: {
					DEFAULT: '#789ABF',
					100: '#D4E3F0', // Lighter
					500: '#5A7BA1' // Darker
				},
				secondary3: {
					DEFAULT: '#9BC1EE',
					100: '#D7E9FD', // Lighter
					500: '#6D9DD9' // Darker
				},
				secondary4: {
					DEFAULT: '#D1EAF7',
					100: '#EAF5FC', // Lighter
					500: '#A5D2EF' // Darker
				},
				accent1: {
					//oren
					DEFAULT: '#E56E44',
					100: '#FBD6CB', // Lighter
					500: '#BF5332' // Darker
				},
				accent2: {
					//blue
					DEFAULT: '#1A385A',
					100: '#92A2BC', // Lighter
					500: '#2563eb' // Darker
				},
				error: {
					DEFAULT: '#D0474C',
					100: '#F5C4C6', // Lighter
					500: '#B23A3F' // Darker
				},
				warning: {
					DEFAULT: '#FFCC00',
					100: '#FFF3CC', // Lighter
					500: '#E6B800' // Darker
				},
				success: {
					DEFAULT: '#BACA6B',
					100: '#EEF4D7', // Lighter
					500: '#A4B155' // Darker
				},
				green: {
					DEFAULT: '#22c55e'
				},
				grayfocus: {
					DEFAULT: '#d1d5db',
					100: '#F8F9FA',
					500: '#6b7280'
				},
				ringblue: {
					DEFAULT: '#3b82f6'
				},
				chat: {
					my: '#dbeafe',
					none: '#f3f4f6'
				},
				text: {
					gray: '#4b5563'
				}
				//   black: {
				// 	DEFAULT: '#000000',
				// 	100: '#EEF4D7',  // Lighter
				// 	500: '#A4B155',  // Darker
				//   }
			}
		}
	},
	plugins: []
};
