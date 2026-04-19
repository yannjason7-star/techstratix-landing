const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ts: {
          blue: "#003366",   // Bleu Logo
          silver: "#E5E7EB", // Gris clair joyeux
          cyan: "#00D1FF",   // Cyan vivant
          deep: "#001A33",   // Fond bleu nuit (pas noir)
        }
      },
      animation: {
        aurora: "aurora 20s linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));
  addBase({ ":root": newVars });
}