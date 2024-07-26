import { z } from "zod";
import db from "src/config/db";

export type ImageFilters = object;

export const imageSchema = z.object({
  id: z.string(),
  imageName: z.string(),
  file: z.instanceof(File),
});

export type Image = {
  id: string;
  imageName: string;
  file: File;
  src: string;
};

export const getImageList = async (_: ImageFilters) => {
  const data = await db.getAll("images");
  const images = imageSchema.array().parse(data);
  return images.map(img => {
    const src = URL.createObjectURL(img.file).toString();

    return {
      ...img,
      src,
    };
  });
};

export const getImageDetails = async (id: string) => {
  const data = await db.getItemById<Image>("images", id);
  const img = imageSchema.parse(data);
  const src = URL.createObjectURL(img.file);
  return {
    ...img,
    src,
  };
};

export const saveImage = async (image: Image) => {
  await db.writeItem("images", image);
};
