import { TextElement as TextElementType } from "../template";
import { TemplateData } from "./Template";

type Props = {
  element: TextElementType;
  data?: TemplateData;
  children?: React.ReactNode;
};

type PropsWithEditMode = ViewModeProps | EditModeProps;

interface ViewModeProps extends Props {
  editMode?: undefined | false | null;
}

interface EditModeProps extends Props {
  editMode: true;
  selectedElement?: string;
}

function TextElement(props: PropsWithEditMode) {
  if (!props.editMode) return <ViewMode {...props} />;
  return <EditMode {...props} />;
}

function RenderTextElement({
  element,
  data,
  children,
}: {
  element: TextElementType;
  data?: TemplateData;
  children?: React.ReactNode;
}) {
  const { dataHeader, fontSize, fontFamily, color } = element;

  const text = data ? data[dataHeader] || "" : dataHeader || "";

  return (
    <div className="relative" style={{ fontSize: `${fontSize}px`, fontFamily, color }}>
      {children && <div className="absolute h-full w-full">{children}</div>}
      {text}
    </div>
  );
}

function EditMode({ element, ...props }: EditModeProps) {
  return <RenderTextElement {...props} element={element}></RenderTextElement>;
}

function ViewMode(props: Props) {
  return <RenderTextElement {...props} />;
}

export default TextElement;
