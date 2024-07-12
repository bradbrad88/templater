import TemplateElement from "./TemplateElement";
import { useElement, useTemplateMain } from "./useTemplateContext";

function TemplateCanvas() {
  const { template } = useTemplateMain();
  const { selectElement, selectedElement } = useElement();

  return (
    <div className="w-full flex justify-center py-20">
      <div
        style={{
          height: `${template.height}${template.units}`,
          width: `${template.width}${template.units}`,
        }}
        className="border-zinc-400 border-[2px]"
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

export default TemplateCanvas;
