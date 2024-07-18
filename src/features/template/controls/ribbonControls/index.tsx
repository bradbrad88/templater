import { Route, Routes } from "react-router";
import ElementControls from "./ElementControls";
import PreviewControls from "./PreviewControls";

function RibbonControls() {
  return (
    <div className="w-full h-20 border-b-[2px] border-zinc-200 px-4">
      <Routes>
        <Route path="" element={<ElementControls />} />
        <Route path="preview" element={<PreviewControls />} />
      </Routes>
    </div>
  );
}

export default RibbonControls;
