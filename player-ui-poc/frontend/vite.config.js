import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendPort = process.env.BACKEND_PORT || 3011;

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT || 5180),
    strictPort: true,
    proxy: { "/api": `http://localhost:${backendPort}` },
  },
  test: {
    environment: "jsdom",
  },
});
