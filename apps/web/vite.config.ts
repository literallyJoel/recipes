import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";

export default defineConfig({
  cacheDir: ".vite",
  server: {
    proxy: {
      "/api": {
        target:
          process.env.VITE_API_PROXY_TARGET ??
          process.env.VITE_API_URL ??
          "http://localhost:8181",
        changeOrigin: true
      }
    }
  },
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", {}]]
      }
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  }
});
