// MarginConfigPanel.jsx
import React from "react";
import MarginInput from "./MarginInput";
import { useLayout } from "../../../context/LayoutProvider";
import { computeAutoMargins } from "../../../utils/computeAutoMargins";

const MarginConfigPanel = () => {
  const layout = useLayout();

  return (
    <div className="w-full flex flex-col p-3 border-b border-nero-900 bg-nero-800">
      <div className="flex flex-col gap-2.5">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-sm text-denim-600 font-semibold uppercase tracking-wide">Margin <span className="text-[11px] font-normal text-nero-400 normal-case">(mm)</span></h2>

          <button
            onClick={() => {
              const { paperWidthPt, paperHeightPt, labelWidthPt, labelHeightPt } =
                layout.values;

              // turn off manual override
              layout.set.setUserMarginOverride(false);

              // if sizes are missing → reset margins to 0
              if (
                !paperWidthPt ||
                !paperHeightPt ||
                !labelWidthPt ||
                !labelHeightPt
              ) {
                layout.set.setTopMargin(0);
                layout.set.setBottomMargin(0);
                layout.set.setLeftMargin(0);
                layout.set.setRightMargin(0);
                return;
              }

              // else → calculate proper auto margins
              computeAutoMargins(layout);
            }}
            className="px-3 py-1 text-xs font-medium text-denim-600 bg-denim-50 border border-denim-100 rounded-full hover:bg-denim-600 hover:text-white hover:border-denim-600 transition-all duration-200 ease-in-out"
          >
            Reset Margin
          </button>

        </div>

        <div className="w-full flex justify-start items-center gap-2">
          <MarginInput label="Top" />
          <MarginInput label="Bottom" />
          <MarginInput label="Left" />
          <MarginInput label="Right" />
        </div>
      </div>
    </div>
  );
};

export default MarginConfigPanel;
