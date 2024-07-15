import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { useTemplate } from "./useTemplateContext";
import { TemplateMainProvider } from "./templateMainContext";
import RibbonControls from "./controls/ribbonControls";

function ViewTemplate() {
  const { templateId } = useParams<{ templateId: string }>();
  const { load, unload, template, ...props } = useTemplate();

  useEffect(() => {
    if (templateId) load(templateId);
    return () => unload();
  }, [templateId, load, unload]);

  if (!template) return null;

  return (
    <TemplateMainProvider {...props} template={template}>
      <RibbonControls />
      <Outlet />
    </TemplateMainProvider>
  );
}

export default ViewTemplate;
