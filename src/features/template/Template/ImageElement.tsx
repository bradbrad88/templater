import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  useDraggable,
} from "@dnd-kit/core";
import { useTemplate } from "../useTemplateContext";
import { ImageElement as ImageElementType } from "../template";

type BaseProps = {
  element: ImageElementType;
};

type Props = ViewModeProps | EditModeProps;

interface ViewModeProps extends BaseProps {
  editMode?: undefined | false | null;
}

interface EditModeProps extends BaseProps {
  editMode: true;
  isSelected: boolean;
}

function ImageElement(props: Props) {
  if (!props.editMode) return <ViewMode {...props} />;
  return <EditMode {...props} />;
}

function RenderImageElement({
  element,
  children,
}: {
  element: ImageElementType;
  children?: React.ReactNode;
}) {
  const { image, width } = element;

  return (
    <div className="relative" style={{ width: `${width}px` }}>
      <img src={image.toString()} style={{ width: `${width}px` }} />
      {children}
    </div>
  );
}

function EditMode({ element, isSelected }: EditModeProps) {
  const { setElementWidth } = useTemplate();
  const [resizing, setResizing] = useState<number | null>(null);

  const confirmWidth = (width: number) => {
    const validatedWidth = Math.max(width + element.width, 0);
    setElementWidth(element.id, validatedWidth);
    setResizing(null);
  };

  const widthWhileResizing = element.width + (resizing ? resizing : 0);

  return (
    <RenderImageElement element={{ ...element, width: widthWhileResizing }}>
      {isSelected && <ResizeFrame setResizing={setResizing} confirmWidth={confirmWidth} />}
    </RenderImageElement>
  );
}

function ViewMode({ element }: ViewModeProps) {
  return <RenderImageElement element={element} />;
}

function ResizeFrame({
  setResizing,
  confirmWidth,
}: {
  setResizing: (width: number | null) => void;
  confirmWidth: (width: number) => void;
}) {
  return (
    <DndContext onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd}>
      <div className="absolute border-red-400 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)] top-[-2px] left-[-2px]">
        <div className="relative h-full w-full">
          <Handle />
        </div>
      </div>
    </DndContext>
  );

  function onDragStart(e: DragStartEvent) {
    console.log(e);
  }

  function onDragMove(e: DragMoveEvent) {
    const delta = e.delta.x;
    setResizing(delta);
  }

  function onDragEnd(e: DragEndEvent) {
    const delta = e.delta.x;
    confirmWidth(delta);
  }
}

function Handle() {
  const { listeners, attributes, setNodeRef } = useDraggable({ id: "handle-br" });

  return (
    <span
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="w-3 h-3 border-black rounded-full bg-white border-[1px] absolute bottom-[2px] right-[2px] translate-x-1/2 translate-y-1/2 z-10"
    ></span>
  );
}

export default ImageElement;
