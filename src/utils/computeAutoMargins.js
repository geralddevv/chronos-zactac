// /src/utils/computeAutoMargins.js

export function computeAutoMargins(layout) {
  const {
    paperWidthPt,
    paperHeightPt,
    labelWidthPt,
    labelHeightPt,
  } = layout.values;

  if (!paperWidthPt || !paperHeightPt || !labelWidthPt || !labelHeightPt) return;

  const cols = Math.floor(paperWidthPt / labelWidthPt);
  const rows = Math.floor(paperHeightPt / labelHeightPt);

  const usedW = cols * labelWidthPt;
  const usedH = rows * labelHeightPt;

  let marginX = Math.max(0, (paperWidthPt - usedW) / 2);
  let marginY = Math.max(0, (paperHeightPt - usedH) / 2);

  // Soft reduction
  const reduceX = paperWidthPt * 0.00008;
  const reduceY = paperHeightPt * 0.00008;

  marginX -= reduceX;
  marginY -= reduceY;

  // APPLY the recalculated margins
  layout.set.setLeftMargin(marginX);
  layout.set.setRightMargin(marginX);
  layout.set.setTopMargin(marginY);
  layout.set.setBottomMargin(marginY);
}
