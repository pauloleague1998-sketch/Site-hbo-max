/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta oficial HBO Max
        brand: "#6B2CF5", // roxo HBO
        magenta: "#D400D4", // magenta intenso
        dark: "#0A0A0A", // fundo principal (preto quase absoluto)
        dark2: "#1A1A1A", // fundo secundário (cinza muito escuro)
        line: "#2A2A2A", // bordas
        muted: "#B3B3B3", // texto secundário
      },
      fontFamily: {
        sans: ["Montserrat", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
