import { queryOptions } from "@tanstack/react-query";
import { getTemplateData } from "./templateData";

export const templateDataKeys = {
  byTemplateId: (templateId: string) => ["templateData", templateId] as const,
};

export const templateDataQuery = (id: string) =>
  queryOptions({
    queryKey: templateDataKeys.byTemplateId(id),
    queryFn: async () => await getTemplateData(id),
  });
