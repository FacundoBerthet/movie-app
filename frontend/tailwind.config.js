/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      transitionDuration: {
        '350': '350ms',
      },
      colors: {
        noche:      "#0e0608",
        sala:       "#120810",
        terciopelo: "#1e0d14",
        cortina:    "#2c1020",
        reflector:  "#c9a84c",
        reflector2: "#e8c96a",
        bordo:      "#4a1a2e",
        bordo2:     "#6b2840",
        crema:      "#f0ece4",
        pergamino:  "#a09880",
        sombra:     "#5a5248",
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        display: ["Playfair Display", "serif"],
      }
    }
  }
}
