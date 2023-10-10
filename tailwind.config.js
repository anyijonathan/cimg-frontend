/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", 
  'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'circular-std': ['Circular Std', 'sans-serif'] 
      },
      screens: {
        md: '768px', 
        xl: "1200px"
      },
         backgroundImage: {
        'onboarding-image': "url('asset/img/bg-image.jpg')"     
      },
      colors: {
        'purple-primary' : '#5C068C',
        'purple-secondary' : '#5C068C',
        'main-background' : '#F4F4F4',
        'other-background' : '#FEFEFE',
        'dashboard-background': '#F6F6F6',
        'green-primary' : '#09B47C',
        'red-primary' : '#F34E4E',
        'yellow-primary' : '#FFB81C',
        'black-primary'  : "#222823",
        'black-secondary' : "#262833",
        'black-70'     : "#334335",
        'black-40'    : "#334335",
        'white' : "#FAFAFA",
        'purple-gradient' : "linear-gradient(89.92deg, #60088C 0.07%, #A11E90 92.22%)"
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
],
}
