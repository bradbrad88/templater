import { useParams } from "react-router";
import { useTemplate, useTemplateMain } from "./useTemplateContext";
import { useEffect } from "react";
import { TemplateMainProvider } from "./templateMainContext";
// import TemplateElement from "./TemplateElement";

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

function TemplateEditor() {
  const { template } = useTemplateMain();
  return (
    <div className="w-full flex justify-center py-20">
      <div
        style={{
          height: `${template.height}${template.units}`,
          width: `${template.width}${template.units}`,
        }}
        className="bg-lime-300"
      >
        {/* {template.elements.map((element, idx) => (
            <TemplateElement key={`${idx}-${element.type}`} templateElement={element} />
          ))} */}
      </div>
    </div>
  );
}

export default EditTemplatePage;
