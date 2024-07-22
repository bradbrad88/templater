import Template from "./Template/Template";
import { useElement, useTemplate } from "./useTemplateContext";

function TemplateEditor() {
  const { template, moveElement } = useTemplate();

  const { selectElement, selectedElementId, deselect } = useElement();

  return (
    <div className="w-full flex justify-center py-20" onClick={deselect}>
      <Template
        template={template}
        selectedElement={selectedElementId}
        onMoveElement={moveElement}
        onSelectElement={selectElement}
        editMode
      />
    </div>
  );
}

export default TemplateEditor;
