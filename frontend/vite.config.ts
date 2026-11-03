import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    // Dev workflow mirrors the single-service production setup: the Express
    // backend (port 3000) owns /api and the Socket.IO server, so the Vite
    // dev server forwards both instead of 404ing them.
    proxy: {
      "/api": { target: "http://localhost:3000" },
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
