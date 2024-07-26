import { useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { moveArrayItem } from "utils/arrays";
import { useElement, useTemplate } from "features/template/useTemplateContext";
import useSortableItems from "src/hooks/useSortableItems";
import { TemplateElement } from "features/template/template";
import { SortableItem } from "common/dnd/SortableItem";
import DragOverlay from "common/dnd/DragOverlay";
import { DragIcon } from "common/icons";
import { exhaustiveSwitchGuard } from "utils/exhaustiveSwitchGuard";

function LayersControl() {
  const { template, rearrangeElementOrder } = useTemplate();
  const [items, setItems] = useSortableItems(template.elements, "id");
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const draggingElement = template.elements.find(el => el.id === isDragging);

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {items.map(elementId => {
            const element = template.elements.find(el => el.id === elementId);
            if (!element) return null;
            return (
              <SortableItem
                id={element.id}
                key={element.id}
                type="element"
                handle
                render={handle => <ElementControl element={element} Handle={handle} />}
              ></SortableItem>
            );
          })}
        </div>
        <DragOverlay isDragging={!!draggingElement}>
          {draggingElement && <ElementControl element={draggingElement} />}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  );

  function onDragStart(e: DragStartEvent) {
    setIsDragging(String(e.active.id));
  }
  function onDragEnd(e: DragEndEvent) {
    const oldIndex = items.indexOf(String(e.active.id));
    const newIndex = items.indexOf(String(e.over?.id));
    const elementId = String(e.active.id);
    // Template operation
    rearrangeElementOrder(elementId, newIndex);
    // Local state
    setItems(prev => moveArrayItem(prev, oldIndex, newIndex));
    setIsDragging(null);
  }
  function onDragCancel() {
    setIsDragging(null);
  }
}

function ElementControl({
  element,
  Handle = EmptyHandle,
}: {
  element: TemplateElement;
  Handle?: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const { selectElement } = useElement();

  return (
    <div
      onClick={() => selectElement(element.id)}
      className="border-[1px] border-zinc-400 rounded-lg p-2 bg-zinc-100 shadow-black/10 shadow-md"
    >
      <div className="flex justify-between capitalize">
        <div className="flex items-center">
          <RenderElement element={element} />
        </div>
        <Handle>
          <DragIcon size={20} />
        </Handle>
      </div>
    </div>
  );
}

function RenderElement({ element }: { element: TemplateElement }) {
  const type = element.type;
  switch (type) {
    case "text":
      return <span>{element.dataHeader}</span>;
    case "image":
      return (
        <div className="w-7 overflow-hidden rounded-md -m-1">
          <img className="" src={element.image.toString()} />
        </div>
      );
    default:
      exhaustiveSwitchGuard(type);
  }
}

function EmptyHandle({ children }: { children?: React.ReactNode }) {
  return children;
}

export default LayersControl;
