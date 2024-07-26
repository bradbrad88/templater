import { queryOptions } from "@tanstack/react-query";
import { TemplateFilters, getTemplateById, getTemplateList } from "./template";
import NotFoundError from "src/errors/NotFoundError";

export const templateKeys = {
  all: () => ["templates"] as const,
  lists: () => [...templateKeys.all(), "list"] as const,
  list: (filters: TemplateFilters) => [...templateKeys.lists(), filters] as const,
  details: () => [...templateKeys.all(), "details"] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

export const templateQuery = (id: string) =>
  queryOptions({
    queryKey: templateKeys.detail(id),
    queryFn: async () => await getTemplateById(id),
    retry: (_, error) => {
      if (error instanceof NotFoundError) return false;
      return true;
    },
  });

export const templateListQuery = (filters: TemplateFilters) =>
  queryOptions({
    queryKey: templateKeys.list(filters),
    queryFn: async () => await getTemplateList(filters),
  });
