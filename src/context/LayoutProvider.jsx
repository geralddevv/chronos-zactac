// src/context/LayoutProvider.jsx
import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const MM_TO_PT = 2.834645669;
  const DEFAULT_WIDTH_MM = 202;
  const DEFAULT_HEIGHT_MM = 90;

  // Units
  const [paperUnit, setPaperUnit] = useState("mm");
  const [labelUnit, setLabelUnit] = useState("mm");

  // Papers
  const [paperWidthPt, setPaperWidthPt] = useState(DEFAULT_WIDTH_MM * MM_TO_PT);
  const [paperHeightPt, setPaperHeightPt] = useState(DEFAULT_HEIGHT_MM * MM_TO_PT);

  // Labels
  const [labelWidthPt, setLabelWidthPt] = useState(DEFAULT_WIDTH_MM * MM_TO_PT);
  const [labelHeightPt, setLabelHeightPt] = useState(DEFAULT_HEIGHT_MM * MM_TO_PT);

  // Orientation
  const [orientation, setOrientation] = useState("portrait");

  // Font scaling
  const [fontScale, setFontScale] = useState(1);

  // Margins
  const [rightMargin, setRightMargin] = useState(0);
  const [leftMargin, setLeftMargin] = useState(0);
  const [topMargin, setTopMargin] = useState(0);
  const [bottomMargin, setBottomMargin] = useState(0);

  // Gaps
  const [gapXPt, setGapXPt] = useState(0 * MM_TO_PT);
  const [gapYPt, setGapYPt] = useState(0 * MM_TO_PT);

  const [userMarginOverride, setUserMarginOverride] = useState(false);

  // Tells SizeConfigPanel that a preset updated sizes
  const [presetUpdate, setPresetUpdate] = useState(false);

  const layout = {
    values: {
      paperUnit,
      labelUnit,
      paperWidthPt,
      paperHeightPt,
      labelWidthPt,
      labelHeightPt,
      orientation,
      fontScale,
      rightMargin,
      leftMargin,
      topMargin,
      bottomMargin,
      userMarginOverride,
      presetUpdate,
      gapXPt,
      gapYPt,
    },

    set: {
      setPaperUnit,
      setLabelUnit,
      setPaperWidthPt,
      setPaperHeightPt,
      setLabelWidthPt,
      setLabelHeightPt,
      setOrientation,
      setFontScale,
      setRightMargin,
      setLeftMargin,
      setTopMargin,
      setBottomMargin,
      setUserMarginOverride,
      setPresetUpdate,
      setGapXPt,
      setGapYPt,
    },
  };

  return (
    <LayoutContext.Provider value={layout}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
