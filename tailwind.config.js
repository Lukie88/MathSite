/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: { extend: {} },
  plugins: [],
  safelist: [
    // text colors used via dynamic theme.primary
    'text-blue-600','text-green-600','text-purple-600','text-teal-600',
    // background shades (normal + hover) used dynamically
    'bg-blue-500','bg-blue-600',
    'bg-green-500','bg-green-600',
    'bg-purple-500','bg-purple-600',
    'bg-teal-500','bg-teal-600',
  ],
}