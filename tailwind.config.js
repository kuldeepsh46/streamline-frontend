/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-radial': 'radial-gradient(circle at 70% 70%, var(--tw-gradient-stops))',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        streamlineBlue : "#28C8ED",
        graySubtitle: "#9F9F9F"
      },
    },
  },
  plugins: [
    ],
};
