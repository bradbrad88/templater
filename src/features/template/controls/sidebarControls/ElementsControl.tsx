import { v4 as uuid } from "uuid";
import Button from "common/Button";
import { TemplateElement } from "../../template";
import { useTemplateSidebar } from "../../useTemplateContext";

function ElementsControl() {
  const { addElement } = useTemplateSidebar();

  const onAddTextElement = () => {
    const id = uuid();
    const element: TemplateElement = {
      id,
      type: "text",
      dataHeader: "Text",
      fontSize: 12,
    };
    addElement(element);
  };

  return (
    <div>
      <Button onClick={onAddTextElement}>Add Text</Button>
    </div>
  );
}

export default ElementsControl;
