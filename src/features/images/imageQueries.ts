import { queryOptions } from "@tanstack/react-query";
import { ImageFilters, getImageDetails, getImageList } from "./images";

export const imageKeys = {
  all: () => ["images"] as const,
  lists: () => [...imageKeys.all(), "list"],
  list: (filters: ImageFilters) => [...imageKeys.lists(), filters] as const,
  details: () => [...imageKeys.all(), "details"] as const,
  detail: (imageId: string) => [...imageKeys.details(), imageId] as const,
};

export const imageListQuery = () =>
  queryOptions({ queryKey: imageKeys.list({}), queryFn: async () => await getImageList({}) });

export const imageDetailsQuery = (id: string) =>
  queryOptions({
    queryKey: imageKeys.detail(id),
    queryFn: async () => await getImageDetails(id),
  });
