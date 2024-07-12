import { useEffect } from "react";
import { useParams } from "react-router";
import { useTemplate } from "./useTemplateContext";
import { TemplateMainProvider } from "./templateMainContext";
import TemplateEditor from "./TemplateEditor";

function EditTemplatePage() {
  const { templateId } = useParams<{ templateId: string }>();
  const { load, unload, template, ...props } = useTemplate();

  useEffect(() => {
    if (templateId) load(templateId);
    return () => unload();
  }, [templateId, load, unload]);

  if (!template) return null;

  return (
    <TemplateMainProvider {...props} template={template}>
      <TemplateEditor />
    </TemplateMainProvider>
  );
}

export default EditTemplatePage;
