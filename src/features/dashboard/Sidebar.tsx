import { Route, Routes } from "react-router";
import TemplateSidebarControls from "features/template/controls/sidebarControls/TemplateSidebarControls";

function Sidebar() {
  return (
    <div className="h-full w-full bg-zinc-100">
      <Routes>
        <Route path="" element={<></>} />
        <Route path="templates/:templateId/*" element={<TemplateSidebarControls />} />
      </Routes>
    </div>
  );
}

export default Sidebar;
