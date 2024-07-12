import Input from "common/Input";
import Label from "common/Label";
import { TextElement } from "features/template/template";
import { useElement, useTemplateMain } from "features/template/useTemplateContext";
import { ChangeEventHandler, useId } from "react";

function RibbonControls() {
  const { selectedElement } = useElement();
  console.log("Ribbon controls selected element", selectedElement);

  const renderControls = () => {
    const type = selectedElement ? selectedElement.type : "default";
    switch (type) {
      case "text":
        return <TextControls element={selectedElement as TextElement} />;

      default:
        return <DefaultControls />;
    }
  };

  return <div className="border-b-[1px] border-zinc-300 py-2 px-4">{renderControls()}</div>;
}

function DefaultControls() {
  return <div>Default Controls</div>;
}

function TextControls({ element }: { element: TextElement }) {
  const { changeElementFontSize } = useTemplateMain();

  const id = useId();

  const onFontSizeChange: ChangeEventHandler<HTMLInputElement> = e => {
    const fontSize = Number(e.target.value);
    if (isNaN(fontSize)) return;
    const change = fontSize - element.fontSize;
    changeElementFontSize(element.id, change);
  };

  return (
    <div>
      <div className="flex flex-col w-28">
        <Label htmlFor={id}>Font size</Label>
        <div className="flex items-center w-full">
          <Input
            id={id}
            type="number"
            inputMode="numeric"
            className="w-full"
            onChange={onFontSizeChange}
            value={element.fontSize}
          />
          <span className="ml-2">px</span>
        </div>
      </div>
    </div>
  );
}

export default RibbonControls;
