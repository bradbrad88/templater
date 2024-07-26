import { useEffect } from "react";
import Template from "./Template/Template";
import { useElement, useTemplate } from "./useTemplateContext";

function TemplateEditor() {
  const { template, moveElement, deleteElement } = useTemplate();

  const { selectElement, selectedElementId, deselect } = useElement();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (["Backspace", "Delete"].includes(key) && selectedElementId != null) {
        deleteElement(selectedElementId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteElement, selectedElementId]);

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
