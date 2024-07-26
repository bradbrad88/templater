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
      <div className="mt-4">
        <UploadImage />
        <ListImages />
      </div>
    </div>
  );
}

function ListImages() {
  const { data } = useSuspenseQuery(imageListQuery());

  return (
    <div className="mt-2">
      {data.length > 0 && <h2>Click on an image to use it</h2>}
      <div className="grid grid-cols-3 gap-2">
        {data.map(image => (
          <ImageListItem key={image.id} image={image} />
        ))}
      </div>
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
    <div className="w-full aspect-square overflow-hidden border-zinc-400 border-[1px] shadow-md shadow-black/20 bg-white rounded-md">
      <img className="block w-full h-full object-cover" src={image.src} onClick={onClick} />
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
        className="px-4 py-1 border-[1px] border-indigo-700 bg-white text-sm h-10 flex justify-center items-center w-full shadow-sm hover:bg-indigo-700/10 rounded-md"
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
