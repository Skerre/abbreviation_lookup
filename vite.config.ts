import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/abbrevation_lookup/",
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
});
