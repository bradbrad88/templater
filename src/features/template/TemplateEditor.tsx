import Template from "./Template/Template";
import { useElement, useTemplateMain } from "./useTemplateContext";

function TemplateEditor() {
  const { template, moveElement } = useTemplateMain();

  const { selectElement, selectedElement, deselect } = useElement();

  return (
    <div className="w-full flex justify-center py-20" onClick={deselect}>
      <Template
        template={template}
        selectedElement={selectedElement?.id}
        onMoveElement={moveElement}
        onSelectElement={selectElement}
        editMode
      />
    </div>
  );
}

export default TemplateEditor;
