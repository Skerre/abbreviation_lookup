import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // Important for GitHub Pages deployment
  build: {
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      format: {
        comments: false
      }
    }
  }
});