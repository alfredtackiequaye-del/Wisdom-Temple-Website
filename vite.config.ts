import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(() => {
  const rootDir = import.meta.dirname;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "."),
      },
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        input: {
          main: path.resolve(rootDir, "index.html"),
          admin: path.resolve(rootDir, "admin/index.html"),
        },
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("scheduler"))
                return "react";
              if (id.includes("motion")) return "motion";
              if (id.includes("lucide-react")) return "icons";
            }
          },
        },
      },
    },
    server: {
      hmr: false,
    },
  };
});
