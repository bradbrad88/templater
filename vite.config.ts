import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import path from "path";

const src = path.resolve(__dirname, "./src");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "",
  resolve: {
    alias: {
      src: src,
      common: src + "/common",
      features: src + "/features",
      utils: src + "/utils",
    },
  },
});
