import { Suspense } from "react";
import { Route, Routes } from "react-router";
import TemplateSidebarControls from "features/template/controls/sidebarControls/TemplateSidebarControls";
import Loading from "common/Loading";

function Sidebar() {
  return (
    <div className="h-full w-full bg-zinc-100">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="" element={<></>} />
          <Route path="templates/:templateId/*" element={<TemplateSidebarControls />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default Sidebar;
