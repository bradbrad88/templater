import { Route, Routes } from "react-router";
import ControlPanel from "../template/controls/ControlPanel";

function Sidebar() {
  return (
    <div className="h-full w-full bg-zinc-100">
      <Routes>
        <Route path="" element={<>Hi</>} />
        <Route path="templates/:templateId" element={<ControlPanel />} />
      </Routes>
    </div>
  );
}

export default Sidebar;
