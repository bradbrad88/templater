import { exhaustiveSwitchGuard } from "../../utils/exhaustiveSwitchGuard";
import type {
  ImageElement as ImageElementType,
  TemplateElement as TemplateElementType,
  TextElement as TextElementType,
} from "./template";

function TemplateElement({ templateElement }: { templateElement: TemplateElementType }) {
  const type = templateElement.type;
  switch (type) {
    case "text":
      return <TextElement element={templateElement} />;
    case "image":
      return <ImageElement element={templateElement} />;
    default:
      exhaustiveSwitchGuard(type);
  }
}

function TextElement({ element }: { element: TextElementType }) {
  return <div style={{ fontSize: `${element.fontSize}px` }}>{element.display}</div>;
}

function ImageElement({ element }: { element: ImageElementType }) {
  return <img src={element.src} />;
}

export default TemplateElement;
