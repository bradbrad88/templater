import { useMutation } from "@tanstack/react-query";
import { Image, saveImage } from "./images";

export function useMutateImage() {
  const mutation = useMutation({
    mutationFn: async (image: Image) => {
      return await saveImage(image);
    },
  });
  return { ...mutation };
}
