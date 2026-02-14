import { PDFDocument } from "pdf-lib";

export default async function mergePDFBuffers(buffers) {
  const merged = await PDFDocument.create();

  for (const buf of buffers) {
    const pdf = await PDFDocument.load(buf);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  return await merged.save();
}
