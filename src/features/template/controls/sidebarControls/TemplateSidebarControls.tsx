import { Route, Routes } from "react-router";
import EditorControls from "./EditorControls";
import PreviewControls from "./PreviewControls";

function TemplateSidebarControls() {
  return (
    <Routes>
      <Route path="" element={<EditorControls />} />
      <Route path="preview" element={<PreviewControls />} />
    </Routes>
  );
}

export default TemplateSidebarControls;
