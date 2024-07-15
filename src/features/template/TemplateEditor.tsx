import TemplateElement from "./TemplateElement";
import { useElement, useTemplateMain } from "./useTemplateContext";

function TemplateEditor() {
  const { template } = useTemplateMain();
  const { selectElement, selectedElement, deselect } = useElement();

  return (
    <div className="w-full flex justify-center py-20" onClick={deselect}>
      <div
        style={{
          height: `${template.height}${template.units}`,
          width: `${template.width}${template.units}`,
        }}
        className="border-zinc-400 border-[2px]"
        onClick={e => e.stopPropagation()}
      >
        {template.elements.map((element, idx) => (
          <TemplateElement
            key={`${idx}-${element.type}`}
            templateElement={element}
            selectElement={() => selectElement(element)}
            selected={!!(selectedElement && selectedElement.id === element.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default TemplateEditor;
