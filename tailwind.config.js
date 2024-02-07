/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBg: "#20293A",
        detailBg: "#111729",
        textColor: "#364153",
        repoColor: "#1D1B48",
      },
    },
  },
  plugins: [],
};
