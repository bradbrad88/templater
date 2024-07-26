import { cn } from "utils/cn";
import { Template as TemplateType } from "../template";
import TemplateElement from "./TemplateElement";
import { DndContext, DragEndEvent, PointerSensor, useSensor } from "@dnd-kit/core";

/*
  Template can either be in view mode or edit mode.

  Template can have data provided or not in both view or edit mode.

  Without data, template elements default to showing their data-header.

  All controls and dnd functionality should be disabled when not in edit mode.

*/

export type OnMoveElement = (
  elementId: string,
  position: { top: number; left: number }
) => void;

export type OnSelectElement = (elementId: string) => void;

type Props = {
  template: TemplateType;
  editMode?: boolean;
  data?: Record<string, string>;
  selectedElement?: string | null;
  onMoveElement?: OnMoveElement;
  onSelectElement?: OnSelectElement;
};

export type TemplateData = Record<string, string>;

function Template({
  template,
  data,
  editMode,
  selectedElement,
  onMoveElement,
  onSelectElement,
}: Props) {
  if (!editMode) return <RenderViewOnlyTemplate template={template} data={data} />;
  return (
    <RenderDroppableTemplate
      template={template}
      data={data}
      selectedElement={selectedElement}
      onMoveElement={onMoveElement}
      onSelectElement={onSelectElement}
    />
  );
}

// **************

function RenderTemplateFrame({
  template,
  children,
  editMode,
}: {
  template: TemplateType;
  children?: React.ReactNode;
  editMode?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative border-[1px] border-zinc-700 overflow-hidden",
        editMode && "overflow-visible"
      )}
      style={{
        width: `${template.width}${template.units}`,
        height: `${template.height}${template.units}`,
      }}
    >
      {children}
    </div>
  );
}

// **************

function RenderViewOnlyTemplate({
  template,
  data,
}: {
  template: TemplateType;
  data?: TemplateData;
}) {
  return (
    <RenderTemplateFrame template={template}>
      <RenderElements template={template} data={data} />
    </RenderTemplateFrame>
  );
}

function RenderDroppableTemplate({
  onMoveElement = () => {},
  ...props
}: {
  template: TemplateType;
  data?: TemplateData;
  selectedElement?: string | null;
  onMoveElement?: OnMoveElement;
  onSelectElement?: OnSelectElement;
}) {
  const id = props.template.id;

  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

  const onDragEnd = ({ active, delta }: DragEndEvent) => {
    if (onMoveElement) onMoveElement(String(active.id), { left: delta.x, top: delta.y });
  };

  return (
    <DndContext id={id} onDragEnd={onDragEnd} sensors={[sensor]}>
      <RenderTemplateFrame template={props.template} editMode>
        <RenderElements {...props} editMode />
      </RenderTemplateFrame>
    </DndContext>
  );
}

function RenderElements(props: {
  template: TemplateType;
  data?: TemplateData;
  editMode?: boolean;
  onSelectElement?: OnSelectElement;
}) {
  const elements = [...props.template.elements].reverse();
  return elements.map(element => (
    <TemplateElement key={element.id} {...props} element={element} />
  ));
}

export default Template;
