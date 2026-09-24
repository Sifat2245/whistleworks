/* eslint-disable */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path";
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    reporters: ["default"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/**/*.test.{js,jsx}",
        "src/**/*.spec.{js,jsx}",
        "src/setupTests.js",
        "src/main.jsx",
        "src/assets/**",
      ],
    },
  },
});
