/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8e2de2',
        secondary: '#4a00e0',
        trafficGreen: '#4caf50',
        trafficRed: '#f44336',
        trafficYellow: '#ffeb3b',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-traffic': 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
      },
    },
  },
  plugins: [],
}
