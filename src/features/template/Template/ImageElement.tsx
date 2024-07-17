import { ImageElement as ImageElementType } from "../template";
import { TemplateData } from "./Template";

type Props = {
  element: ImageElementType;
  data?: TemplateData;
};

function ImageElement({ element }: Props) {
  const { src, width } = element;

  return <img src={src} style={{ width: `${width}px` }} />;
}

export default ImageElement;
