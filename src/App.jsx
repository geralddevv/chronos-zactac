import PresetHolder from "./components/presets/PresetHolder";
import Panel from "./components/Panel";
import { RefreshProvider } from "./context/RefreshContext";
import Snowfall from "react-snowfall";

export default function App() {
  return (
    <main className="min-h-screen bg-nero-900 flex flex-wrap-reverse items-center justify-start select-none">
      {/* <Snowfall color="white" className="z-100" snowflakeCount={1100} speed={[0.5, 2]} wind={[-0.5, 2]} radius={[0.5, 3]} /> */}
      <RefreshProvider>
        <PresetHolder />
        <Panel />
      </RefreshProvider>
    </main>
  );
}
