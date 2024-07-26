import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, saveImage } from "./images";
import { imageKeys } from "./imageQueries";

export function useMutateImage() {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (image: Image) => {
      return await saveImage(image);
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: imageKeys.lists() });
    },
  });
  return { ...mutation };
}
