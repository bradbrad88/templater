import { useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useElement, useTemplateSidebar } from "features/template/useTemplateContext";
import { TemplateElement } from "features/template/template";
import { SortableItem } from "common/dnd/SortableItem";
import DragOverlay from "common/dnd/DragOverlay";
import { DragIcon } from "common/icons";

function LayersControl() {
  const { template, rearrangeElementOrder } = useTemplateSidebar();
  const [isDragging, setIsDragging] = useState<string | null>(null);

  if (!template) throw new Error("Template data missing, can not render layers");

  const items = template.elements.map(el => el.id);
  const draggingElement = template.elements.find(el => el.id === isDragging);

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {template.elements.map(element => (
            <SortableItem
              id={element.id}
              key={element.id}
              type="element"
              handle
              render={handle => <ElementControl element={element} Handle={handle} />}
            ></SortableItem>
          ))}
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
    const newIndex = items.indexOf(String(e.over?.id));
    const elementId = String(e.active.id);
    rearrangeElementOrder(elementId, newIndex);
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
        {element.type} - {"dataHeader" in element && element.dataHeader}
        <Handle>
          <DragIcon size={20} />
        </Handle>
      </div>
    </div>
  );
}

function EmptyHandle({ children }: { children?: React.ReactNode }) {
  return children;
}

export default LayersControl;
