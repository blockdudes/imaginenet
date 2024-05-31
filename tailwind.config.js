/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f8f8f8",
        secondary: "#4f28cd",
        tertiary: "#f8f8f8",
        "primary-text": "white",
      },
      backgroundColor: {
        primary: "#1d1d26",
        btn: "purple",
      },
      borderRadius: {
        primary: "10px",
        secondary: "10px",
        tertiary: "10px",
      },
      borderColor: {
        primary: "green",
        secondary: "#f8f8f8",
        tertiary: "#f8f8f8",
      },
    },
  },
  plugins: [],
};
