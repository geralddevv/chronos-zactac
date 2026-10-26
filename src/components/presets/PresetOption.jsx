// PresetOption.jsx FIXED
import { useLayout } from "../../context/LayoutProvider";
import { useRefresh } from "../../context/RefreshContext";
import PresetPortraitImg from "../../assets/preset-portrait-img.svg";
import PresetLandscapeImg from "../../assets/preset-landscape-img.svg";

const PresetOption = ({ paperName, width, height, selected, onSelect }) => {
  const layout = useLayout();
  const { handleRefresh } = useRefresh();

  const mmToPt = (mm) => mm * 2.8346456693;

  const applyPreset = () => {
    // UI knows preset is updating
    layout.set.setPresetUpdate(true);

    // force mm
    layout.set.setPaperUnit("mm");

    // assign paper size
    layout.set.setPaperWidthPt(mmToPt(width));
    layout.set.setPaperHeightPt(mmToPt(height));

    // full reset: clear labels + resetSignal + reset upload UI
    handleRefresh();

    // ALSO reset label size UI values (if needed)
    layout.set.setUserMarginOverride(false);
  };

  const previewImg = width > height ? PresetLandscapeImg : PresetPortraitImg;

  return (
    <button
      onClick={() => {
        onSelect();
        applyPreset();
      }}
      className={`
    group
    w-full h-full flex flex-col items-center justify-center p-4 gap-4 rounded-md border
    transition-colors duration-150 focus:outline-none
    ${selected
          ? "ring-2 ring-denim-600 ring-inset border-denim-600 bg-denim-50"
          : "bg-nero-800 border-nero-900 hover:bg-denim-50 hover:border-denim-200 ring-0"
        }
  `}
    >
      <img src={previewImg} className="w-24 h-24 rounded-md" />

      <span className="flex flex-col justify-center items-center text-sm font-semibold text-nero-300">
        <h4 className="text-base group-hover:text-denim-600 transition-colors duration-150">
          {paperName}
        </h4>
        <h4 className="font-medium text-nero-400">{`${width} x ${height} mm`}</h4>
      </span>
    </button>
  );
};

export default PresetOption;
