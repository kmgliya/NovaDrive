import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff5f00', // Оранжевый акцент
        dark: '#121212',    // Основной фон (почти черный)
        surface: '#1E1E1E', // Фон для карточек (чуть светлее)
        text: '#ffffff',    // Белый текст
        muted: '#888888',   // Серый текст
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'var(--font-inter)', 'Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;