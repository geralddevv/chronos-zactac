import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { handlePdfBackupRequest } from "./server/pdfBackup.js";

const pdfBackupPlugin = () => ({
  name: "pdf-backup-plugin",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (await handlePdfBackupRequest(req, res)) {
        return;
      }

      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (await handlePdfBackupRequest(req, res)) {
        return;
      }

      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), pdfBackupPlugin()],
  define: {
    global: "globalThis",
  },
});
