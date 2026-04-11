import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { handlePdfBackupRequest } from "./server/pdfBackup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");
const port = Number(process.env.PORT) || 3001;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const serveFile = (filePath, res) => {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[ext] || "application/octet-stream";

  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);
  fs.createReadStream(filePath).pipe(res);
};

const server = http.createServer(async (req, res) => {
  if (await handlePdfBackupRequest(req, res)) {
    return;
  }

  const requestPath = req.url?.split("?")[0] || "/";
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const requestedFile =
    safePath === "/" ? "index.html" : safePath.replace(/^[/\\]/, "");
  const filePath = path.join(distDir, requestedFile);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveFile(filePath, res);
    return;
  }

  const indexPath = path.join(distDir, "index.html");
  if (fs.existsSync(indexPath)) {
    serveFile(indexPath, res);
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("Build output not found. Run `npm run build` first.");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
