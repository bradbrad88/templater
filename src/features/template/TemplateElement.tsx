import { exhaustiveSwitchGuard } from "../../utils/exhaustiveSwitchGuard";
import type {
  ImageElement as ImageElementType,
  TemplateElement as TemplateElementType,
  TextElement as TextElementType,
} from "./template";

function TemplateElement({
  templateElement,
  selectElement,
  selected,
}: {
  templateElement: TemplateElementType;
  selectElement: () => void;
  selected: boolean;
}) {
  const type = templateElement.type;
  switch (type) {
    case "text":
      return (
        <TextElement
          element={templateElement}
          selected={selected}
          selectElement={selectElement}
        />
      );
    case "image":
      return <ImageElement element={templateElement} />;
    default:
      exhaustiveSwitchGuard(type);
  }
}

function TextElement({
  element,
  selected,
  selectElement,
}: {
  element: TextElementType;
  selected: boolean;
  selectElement: () => void;
}) {
  return (
    <div
      onClick={selectElement}
      style={{ fontSize: `${element.fontSize}px`, border: selected ? "solid 1px yellow" : "" }}
    >
      {element.dataHeader}
    </div>
  );
}

function ImageElement({ element }: { element: ImageElementType }) {
  return <img src={element.src} />;
}

export default TemplateElement;
