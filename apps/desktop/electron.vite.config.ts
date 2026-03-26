import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    root: "./src/renderer",
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      TanStackRouterVite({
        target: "react",
        autoCodeSplitting: false,
        routesDirectory: "./routes",
        generatedRouteTree: "./routeTree.gen.ts",
      }),
      tailwindcss(),
      react(),
    ],
  },
});
