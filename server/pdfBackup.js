import fs from "node:fs/promises";
import path from "node:path";

const BACKUP_DIR = path.resolve(process.cwd(), "backup");

const sanitizeFileName = (fileName = "output.pdf") => {
  const normalized = path
    .basename(String(fileName))
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

  return normalized.toLowerCase().endsWith(".pdf")
    ? normalized
    : `${normalized}.pdf`;
};

const buildBackupFileName = (fileName) => {
  const sanitized = sanitizeFileName(fileName);
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const rawHours = now.getHours();
  const hours12 = rawHours % 12 || 12;
  const meridiem = rawHours >= 12 ? "PM" : "AM";
  const hours = String(hours12).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const timeStamp = `${hours}-${minutes}-${meridiem}`;

  return `${day}-${month}-${year}-${timeStamp}-${sanitized}`;
};

export const savePdfBackup = async (pdfBuffer, fileName) => {
  await fs.mkdir(BACKUP_DIR, { recursive: true });

  const backupFileName = buildBackupFileName(fileName);
  const targetPath = path.join(BACKUP_DIR, backupFileName);

  await fs.writeFile(targetPath, pdfBuffer);

  return targetPath;
};

export const handlePdfBackupRequest = async (req, res) => {
  if (req.method !== "POST" || req.url?.split("?")[0] !== "/api/backup-pdf") {
    return false;
  }

  try {
    const requestUrl = new URL(req.url, "http://localhost");
    const fileName = requestUrl.searchParams.get("filename") || "output.pdf";

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const pdfBuffer = Buffer.concat(chunks);

    if (!pdfBuffer.length) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Empty PDF payload" }));
      return true;
    }

    await savePdfBackup(pdfBuffer, fileName);

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
    return true;
  } catch (error) {
    console.error("Failed to back up PDF:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Failed to save PDF backup" }));
    return true;
  }
};
