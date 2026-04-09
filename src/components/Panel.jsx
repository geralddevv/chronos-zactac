import { useRefresh } from "../context/RefreshContext";
import SizeConfigPanel from "./panel/sizes/SizeConfigPanel";
import MarginConfigPanel from "./panel/margin/MarginConfigPanel";
import Orientation from "./ui/Orientation";
import UploadExcel from "./UploadExcel";

const Panel = () => {
  const { labels, setLabels, resetSignal } = useRefresh();

  const hasLabels = labels.length > 0;

  return (
    <>
      <div
        className="w-full sm:w-[50%] md:w-[40%] lg:w-[33%] xl:w-[28%] h-screen bg-ner0-800"
      >
        <div className='w-full bg-nero-800 text-nero-300 text-xl px-4 py-2'>
          Configuration
        </div>

        <div className="minimal-scrollbar overflow-y-auto overflow-x-hidden w-full h-[calc(100vh-44px)] flex flex-col justify-start items-center bg-nero-800 border-t-2 border-nero-900 text-nero-300">
          <SizeConfigPanel />
          <MarginConfigPanel />
          <Orientation />
          <UploadExcel
            setLabels={setLabels}
            resetSignal={resetSignal}
            hasLabels={hasLabels}
            labelsLength={labels.length}
            labels={labels}
          />
        </div>
      </div>
    </>
  );
};

export default Panel;
