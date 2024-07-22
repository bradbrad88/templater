import { cn } from "utils/cn";
import { TemplateElement as TemplateElementType } from "../template";
import TextElement from "./TextElement";
import { exhaustiveSwitchGuard } from "utils/exhaustiveSwitchGuard";
import { OnSelectElement } from "./Template";
import Draggable from "common/dnd/Draggable";
import ImageElement from "./ImageElement";

type Props = {
  element: TemplateElementType;
  data?: Record<string, string>;
  editMode?: boolean;
  selectedElement?: string | null;
  onSelectElement?: OnSelectElement;
};
function TemplateElement(props: Props) {
  const type = props.element.type;
  const editMode = props.editMode;
  const isSelected = props.selectedElement === props.element.id;

  const renderElement = () => {
    switch (type) {
      case "text": {
        return <TextElement {...props} element={props.element} />;
      }
      case "image":
        return <ImageElement {...props} element={props.element} isSelected={isSelected} />;
      default:
        exhaustiveSwitchGuard(type);
    }
  };

  const handleSelect: React.PointerEventHandler = e => {
    if (props.onSelectElement) {
      e.stopPropagation();
      props.onSelectElement(props.element.id);
    }
  };

  const renderElementWithPosition = () => (
    <PositionFrame top={props.element.top} left={props.element.left}>
      {renderElement()}
    </PositionFrame>
  );

  if (!editMode) return renderElementWithPosition();

  return (
    <PositionFrame top={props.element.top} left={props.element.left}>
      <div onPointerDown={handleSelect} onClick={e => e.stopPropagation()}>
        <Draggable id={props.element.id} data={props.element}>
          {renderElement()}
          <div
            className={cn(
              "absolute w-[calc(100%_+_4px)] h-[calc(100%_+_4px)] translate-x-[-2px] translate-y-[-2px] hover:border-[2px] top-0 left-0",
              isSelected && "border-lime-400 border-[2px]",
              "hover:border-indigo-500"
            )}
          ></div>
        </Draggable>
      </div>
    </PositionFrame>
  );
}

function PositionFrame({
  left,
  top,
  children,
}: {
  top: number;
  left: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="absolute" style={{ top: `${top}px`, left: `${left}px` }}>
      {children}
    </div>
  );
}

export default TemplateElement;
