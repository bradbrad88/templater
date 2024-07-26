import { useId } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import { imageListQuery } from "features/images/imageQueries";
import { TemplateImage } from "../../template";
import { useTemplate } from "features/template/useTemplateContext";
import { useMutateImage } from "features/images/useMutateImages";
import { Image } from "features/images/images";
import Button from "common/Button";

import type { ImageElement, TemplateElement } from "../../template";

function ElementsControl() {
  const { addElement } = useTemplate();

  const onAddTextElement = () => {
    const id = uuid();
    const element: TemplateElement = {
      id,
      type: "text",
      dataHeader: "Text",
      fontSize: 12,
      left: 0,
      top: 0,
    };
    addElement(element);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={onAddTextElement} variant={"outline"}>
        Add Text
      </Button>
      <UploadImage />
      <ListImages />
    </div>
  );
}

function ListImages() {
  const { data } = useSuspenseQuery(imageListQuery());

  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(0,_100px))] gap-2">
      {data.map(image => (
        <ImageListItem key={image.id} image={image} />
      ))}
    </div>
  );
}

function ImageListItem({ image }: { image: Image }) {
  const { addElement } = useTemplate();
  const onClick = () => {
    const imageElement: ImageElement = {
      type: "image",
      id: uuid(),
      left: 0,
      top: 0,
      image: new TemplateImage(image.file),
      width: 200,
    };
    addElement(imageElement);
  };
  return (
    <div className="w-full h-full overflow-hidden border-zinc-400 border-[1px] shadow-md shadow-black/20 bg-white rounded-md">
      <img className="block w-full h-full" src={image.src} onClick={onClick} />
    </div>
  );
}

function UploadImage() {
  const { mutate: createImage } = useMutateImage();
  const id = useId();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = URL.createObjectURL(file).toString();
    const image: Image = {
      id: uuid(),
      imageName: file.name,
      file,
      src,
    };
    createImage(image);
  };

  return (
    <div className="w-full">
      <label
        className="px-4 py-1 border-[1px] border-indigo-700 rounded-lg bg-indigo-600 text-white text-sm h-10 flex justify-center items-center w-full"
        htmlFor={id}
      >
        Upload Image
      </label>
      <input
        id={id}
        onChange={onFileChange}
        type="file"
        accept="application/jpg,application/jpeg,application/png"
        className="hidden"
      />
    </div>
  );
}

export default ElementsControl;
