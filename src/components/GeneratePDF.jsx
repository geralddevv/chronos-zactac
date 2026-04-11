import { Document, Page, pdf, View, Text } from "@react-pdf/renderer";
import { generateQR } from "../utils/generateQR";
import { generateBarcode } from "../utils/generateBarcode";
import { useState, useEffect, useRef } from "react";
import { addTrimMarksToPDF } from "../utils/TrimMarksPDFLib";
import TokenTemplate from "../utils/TokenTemplate";
import { useLayout } from "../context/LayoutProvider";
import mergePDFBuffers from "../utils/mergePDFBuffers";
import ProgressBar from "../utils/ProgressBar";
import { useRefresh } from "../context/RefreshContext";
import Toast from "../utils/Toast";


import { AnimatePresence, motion } from "framer-motion";

// LABEL GAPS (print units: points)

function computeAutoMargins(layout) {
  const {
    paperWidthPt,
    paperHeightPt,
    labelWidthPt,
    labelHeightPt,
  } = layout.values;

  if (!paperWidthPt || !paperHeightPt || !labelWidthPt || !labelHeightPt)
    return;

  const { gapXPt, gapYPt } = layout.values;

  const cols = Math.floor(
    (paperWidthPt + gapXPt) / (labelWidthPt + gapXPt)
  );

  const rows = Math.floor(
    (paperHeightPt + gapYPt) / (labelHeightPt + gapYPt)
  );

  const usedW =
    cols * labelWidthPt + Math.max(0, cols - 1) * gapXPt;

  const usedH =
    rows * labelHeightPt + Math.max(0, rows - 1) * gapYPt;


  let marginX = Math.max(0, (paperWidthPt - usedW) / 2);
  let marginY = Math.max(0, (paperHeightPt - usedH) / 2);

  marginX -= paperWidthPt * 0.00008;
  marginY -= paperHeightPt * 0.00008;

  if (!layout.values.userMarginOverride) {
    layout.set.setLeftMargin(marginX);
    layout.set.setRightMargin(marginX);
    layout.set.setTopMargin(marginY);
    layout.set.setBottomMargin(marginY);
  }
}

const PDFDoc = ({
  labels,
  qrList,
  layout,
  pageOffset,
  totalSheets,
  totalLabels,
  code,
  lot,
  job,
}) => {

  const { values } = layout;

  const {
    paperWidthPt,
    paperHeightPt,
    labelWidthPt,
    labelHeightPt,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    fontScale,
    gapXPt,
    gapYPt,
  } = values;

  const usableW = paperWidthPt - leftMargin - rightMargin;
  const usableH = paperHeightPt - topMargin - bottomMargin;

  const columns = Math.max(
    1,
    Math.floor((usableW + gapXPt) / (labelWidthPt + gapXPt))
  );

  const rows = Math.max(
    1,
    Math.floor((usableH + gapYPt) / (labelHeightPt + gapYPt))
  );

  const perPage = columns * rows;

  const pages = [];
  for (let i = 0; i < labels.length; i += perPage) {
    pages.push(labels.slice(i, i + perPage));
  }

  return (
    <Document>
      {pages.map((pageLabels, pIndex) => (
        <Page
          key={pIndex}
          size={{ width: paperWidthPt, height: paperHeightPt }}
          style={{ position: "relative" }}
        >
          <View
            style={{
              position: "absolute",

              // container = full top margin band
              top: 0,
              height: topMargin,

              // anchored to paper edge
              right: rightMargin,

              width: paperWidthPt,

              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
          </View>
          <View
            style={{
              position: "absolute",

              // container = full top margin band
              bottom: 0,
              height: bottomMargin,

              // anchored to paper edge
              left: leftMargin,

              width: paperWidthPt,

              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
          </View>

          {pageLabels.map((label, i) => {
            const globalIndex = pIndex * perPage + i;
            const row = Math.floor(i / columns);
            const col = i % columns;

            const x = leftMargin + col * (labelWidthPt + gapXPt);
            const y = topMargin + row * (labelHeightPt + gapYPt);

            const qrObj = qrList[globalIndex] || {};

            return (
              <View
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: labelWidthPt,
                  height: labelHeightPt,
                }}
              >

                <TokenTemplate
                  label={label}
                  qrCode={qrObj.mainQr}
                  internalQr={qrObj.internalQr}
                  barcode={qrObj.barcode}
                  agentNameQr={qrObj.agentNameQr}
                  fieldBarcodes={qrObj.fieldBarcodes}
                  labelWidthPt={labelWidthPt}
                  labelHeightPt={labelHeightPt}
                  fontSize={5 * fontScale}
                />
              </View>
            );
          })}
        </Page>
      ))}
    </Document>
  );
};

const split = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const getFirstFieldValue = (label, keys) => {
  for (const key of keys) {
    const value = label?.[key];
    if (value !== null && value !== undefined && value !== "") return value;
  }
  return null;
};

const getLabelTextValue = (label, key) => {
  const value = label?.[key];
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const calculatePerPage = (layout) => {
  const {
    paperWidthPt,
    paperHeightPt,
    labelWidthPt,
    labelHeightPt,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    gapXPt,
    gapYPt,
  } = layout.values;

  const usableW = paperWidthPt - leftMargin - rightMargin;
  const usableH = paperHeightPt - topMargin - bottomMargin;

  const cols = Math.floor(
    (usableW + gapXPt) / (labelWidthPt + gapXPt)
  );

  const rows = Math.floor(
    (usableH + gapYPt) / (labelHeightPt + gapYPt)
  );

  return cols * rows;
};

const backupPdfSilently = async (blob, fileName) => {
  try {
    await fetch(`/api/backup-pdf?filename=${encodeURIComponent(fileName)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/pdf",
      },
      body: blob,
    });
  } catch (error) {
    console.error("Failed to back up generated PDF:", error);
  }
};

export default function GeneratePDF({ labels, jobMeta, uploadedFileName, error }) {
  const { resetSignal } = useRefresh();

  const qrListRef = useRef([]);
  // [{ mainQr, internalQr, barcode, fieldBarcodes }]
  const [pdfBlob, setPdfBlob] = useState(null);

  const [isReady, setIsReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const [phase, setPhase] = useState("qr");

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const layout = useLayout();

  useEffect(() => {
    setProgress(0);
    setPhase("qr");
    setPdfBlob(null);
    qrListRef.current = []; // reset
    setIsReady(false);
    setIsGenerating(false);
  }, [resetSignal]);

  useEffect(() => {
    computeAutoMargins(layout);
  }, [
    layout.values.paperWidthPt,
    layout.values.paperHeightPt,
    layout.values.labelWidthPt,
    layout.values.labelHeightPt,
    layout.values.gapXPt,
    layout.values.gapYPt,
    layout.values.userMarginOverride,
  ]);

  // QR GENERATION (optimized)
  useEffect(() => {
    const run = async () => {
      if (!labels.length) return;

      setProgress(0);
      setPhase("qr");

      const batches = split(labels, 100);
      const temp = [];
      const barcodeFields = [
        { label: "PRODUCT", keys: ["PRODUCT BARCODE", "PRODUCT"] },
        { label: "QUANTITY", keys: ["QUANTITY", "QUANTITY MSI"] },
        { label: "LENGTH", keys: ["LENGTH"] },
        { label: "WIDTH", keys: ["WIDTH"] },
        { label: "CORE ID", keys: ["CORE ID"] },
        {
          label: "CUST ORDER",
          keys: ["ORDER"],
        },
      ];

      for (let b of batches) {
        for (let label of b) {
          const qrValue =
            label.qrCode !== undefined
              ? label.qrCode
              : label["Code URL"];

          const mainQr =
            qrValue !== undefined && qrValue !== null && qrValue !== ""
              ? await generateQR(qrValue.toString())
              : null;


          const internalQr = label["Internal Code"]
            ? await generateQR(label["Internal Code"].toString())
            : null;

          const barcode = label["ROLL ID"]
            ? await generateBarcode(label["ROLL ID"])
            : null;

          const productValue = [
            getLabelTextValue(label, "PRODUCT"),
            getLabelTextValue(label, "PRODUCT1"),
          ]
            .filter(Boolean)
            .join(", ");

          const agentQrPayload = [
            getLabelTextValue(label, "AGENT NAME"),
            getLabelTextValue(label, "CUSTOMER"),
            productValue,
            getLabelTextValue(label, "ORDER"),
            getLabelTextValue(label, "WIDTH"),
            getLabelTextValue(label, "LENGTH"),
            getLabelTextValue(label, "SPLICE"),
            getLabelTextValue(label, "SLIT BY"),
            getLabelTextValue(label, "ROLL ID"),
            getLabelTextValue(label, "CORE ID"),
          ].join(" | ");

          const agentNameQr = agentQrPayload.replace(/\s|\|/g, "")
            ? await generateQR(agentQrPayload)
            : null;

          const fieldBarcodeEntries = await Promise.all(
            barcodeFields.map(async (field) => {
              const value = getFirstFieldValue(label, field.keys);
              const fieldBarcode = value ? await generateBarcode(value) : null;
              return [field.label, fieldBarcode];
            })
          );
          const fieldBarcodes = Object.fromEntries(fieldBarcodeEntries);

          temp.push({ mainQr, internalQr, barcode, agentNameQr, fieldBarcodes });

          setProgress(Math.round((temp.length / labels.length) * 50));
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      qrListRef.current = temp; // no rerenders
      setProgress(50);
      setIsReady(true);
    };

    run();
  }, [labels]);

  // PAGE GENERATION + MERGING
  useEffect(() => {
    const run = async () => {
      if (!isReady || qrListRef.current.length !== labels.length) return;

      setIsGenerating(true);
      setPhase("pdf");

      const perPage = calculatePerPage(layout);
      const labelPages = split(labels, perPage);
      const totalSheets = Math.ceil(labels.length / perPage);
      const qrPages = split(qrListRef.current, perPage);

      const buffers = [];

      let globalPageOffset = 0;

      for (let i = 0; i < labelPages.length; i++) {

        setProgress(50 + Math.round(((i + 1) / labelPages.length) * 40));

        const blob = await pdf(
          <PDFDoc
            labels={labelPages[i]}
            qrList={qrPages[i]}
            layout={layout}
            pageOffset={globalPageOffset}
            totalSheets={totalSheets}
            totalLabels={labels.length}
            code={jobMeta.code}
            lot={jobMeta.lot}
            job={jobMeta.job}
          />

        ).toBlob();

        const raw = await blob.arrayBuffer();
        buffers.push(raw);
        globalPageOffset += Math.ceil(labelPages[i].length / perPage);

      }

      setPhase("merge");
      setProgress(95);

      const merged = await mergePDFBuffers(buffers);

      const trimmedPdf = await addTrimMarksToPDF(
        merged,
        layout.values
      );

      const finalPdfBlob = new Blob([trimmedPdf], { type: "application/pdf" });

      await backupPdfSilently(finalPdfBlob, getOutputFileName());
      setPdfBlob(finalPdfBlob);

      setProgress(100);
      setIsGenerating(false);

      setToastMsg("PDF Generated!");
      setShowToast(true);
    };

    run();
  }, [isReady, labels, layout.values]);

  if (!labels.length || error) return null;

  const getOutputFileName = () => {
    if (!uploadedFileName) return "output.pdf";
    return uploadedFileName.replace(/\.[^/.]+$/, ".pdf");
  };


  return (
    <div className="w-full flex flex-col items-center gap-4 bg-nero-800 p-2.5">
      <AnimatePresence mode="wait">
        {(phase === "qr" || phase === "pdf" || phase === "merge") && (
          <ProgressBar progress={progress} phase={phase} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pdfBlob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              className="w-48 h-8 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-denim-600 hover:bg-denim-700 active:scale-95 transition-all"
              onClick={() => {
                const url = URL.createObjectURL(pdfBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = getOutputFileName();
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
