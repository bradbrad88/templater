import { Route, Routes, useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { templateQuery } from "features/template/templateQueries";
import { TemplateProvider } from "features/template/templateContext";
import EditorControls from "./EditorControls";
import PreviewControls from "./PreviewControls";

function TemplateSidebarControls() {
  const { templateId } = useParams<{ templateId: string }>();
  const { data } = useSuspenseQuery(templateQuery(templateId!));

  return (
    <TemplateProvider template={data}>
      <Routes>
        <Route path="" element={<EditorControls />} />
        <Route path="preview" element={<PreviewControls />} />
      </Routes>
    </TemplateProvider>
  );
}

export default TemplateSidebarControls;
