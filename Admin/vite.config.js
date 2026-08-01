import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

function redirectRootToAdmin() {
  return {
    name: "redirect-root-to-admin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "/";
        if (url === "/" || url === "") {
          res.statusCode = 302;
          res.setHeader("Location", "/admin/");
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: "/admin/",
  plugins: [react(), tailwindcss(), redirectRootToAdmin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    open: "/admin/",
  },
  preview: {
    host: true,
    port: 5174,
    open: "/admin/",
  },
});
