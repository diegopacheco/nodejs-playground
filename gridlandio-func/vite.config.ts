import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { gridlandWebPlugin } from "@gridland/web/vite-plugin";

export default defineConfig({
  plugins: [react(), ...gridlandWebPlugin()],
});
