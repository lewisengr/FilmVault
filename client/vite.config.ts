import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false, // Disable source maps for production builds
    minify: "esbuild", // Use esbuild for minification
  },
});
