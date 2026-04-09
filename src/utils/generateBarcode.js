import * as bwipjs from "bwip-js";

export const generateBarcode = async (value) => {
  if (value === null || value === undefined || value === "") return null;

  try {
    const canvas = document.createElement("canvas");

    bwipjs.toCanvas(canvas, {
      bcid: "code128",
      text: String(value),
      scale: 2,
      height: 10,
      includetext: false,
      textxalign: "left",
      backgroundcolor: "FFFFFF",
      paddingwidth: 0,
      paddingheight: 0,
    });

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Barcode generation failed:", err);
    return null;
  }
};
