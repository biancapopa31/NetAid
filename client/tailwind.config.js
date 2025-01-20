const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui(
      {
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#1CBB83",
          },
          secondary: {
            DEFAULT: "#0CBB83",
          },
          success: {
          DEFAULT: "#12C46A",
          },
          info: {
          DEFAULT: "#236CFF",
          },
          warning: {
            DEFAULT: "#FFCC00",
          },
          danger: {
            DEFAULT: "#ff2d45",
          },
        }
      },
    }
  }
    )
  ]
}

