import { Route, Routes, useParams } from "react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { templateQuery } from "features/template/templateQueries";
import { TemplateProvider } from "features/template/templateContext";
import { TemplateDataProvider } from "features/templateData/TemplateDataContext";
import EditorControls from "./EditorControls";
import PreviewControls from "./PreviewControls";
import { templateDataQuery } from "features/templateData/templateDataQueries";

function TemplateSidebarControls() {
  const { templateId } = useParams<{ templateId: string }>();
  const { data: template } = useSuspenseQuery(templateQuery(templateId!));
  const { data: templateData } = useQuery(templateDataQuery(templateId!));

  return (
    <TemplateProvider template={template}>
      <TemplateDataProvider templateData={templateData}>
        <Routes>
          <Route path="*" element={<EditorControls />} />
          <Route path="preview" element={<PreviewControls />} />
        </Routes>
      </TemplateDataProvider>
    </TemplateProvider>
  );
}

export default TemplateSidebarControls;
