import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Matches your setup
    open: true, // Opens in the default browser
  },
  base: "/", // Ensures paths are resolved correctly
});