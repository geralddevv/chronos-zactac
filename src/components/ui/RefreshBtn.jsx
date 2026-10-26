import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useRefresh } from "../../context/RefreshContext";

function RefreshBtn() {
  const { handleRefresh } = useRefresh();

  return (
    <button
      onClick={handleRefresh}
      className="group flex justify-center items-center w-full h-8 bg-denim-600 border border-denim-600 text-white font-bold rounded-md transition-all duration-200 hover:bg-denim-700 focus:outline-none focus:ring-2 focus:ring-denim-600/30"
    >
      <AutorenewIcon
        fontSize="small"
        className="text-white transition-colors duration-200"
      />
      {/* <span className="text-sm text-nero-400 font-medium pl-1 group-hover:text-nero-300 transition-colors duration-200">
        Reset
      </span> */}
    </button>
  );
}

export default RefreshBtn;
