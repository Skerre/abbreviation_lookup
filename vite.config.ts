import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/abbreviation_lookup/", // Fixed spelling in the base path
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
});