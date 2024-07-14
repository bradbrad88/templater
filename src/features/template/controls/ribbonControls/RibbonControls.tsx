import { useElement } from "features/template/useTemplateContext";
import TextControls from "./TextControls";
import DefaultControls from "./DefaultControls";
import { TextElement } from "features/template/template";

function RibbonControls() {
  const { selectedElement } = useElement();

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

export default RibbonControls;
