import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveTemplateData, TemplateData } from "./templateData";
import { templateDataQuery } from "./templateDataQueries";

type UseTemplateData = {
  uploadData: (templateData: TemplateData) => void;
  deleteData: () => void;
};
export function useTemplateDataOperations(
  templateData?: TemplateData | null,
): UseTemplateData {
  const { mutate } = useMutateTemplateData();

  const uploadData = (templateData: TemplateData) => {
    return { ...templateData };
  };

  const deleteData = () => {
    if (!templateData)
      throw new Error(
        "Error trying to delete Template Data. useTemplateDataOperations not initialised with templateData",
      );
    return templateData;
  };

  const withMutate =
    <Args extends unknown[]>(fn: (...args: Args) => TemplateData) =>
    (...args: Args) => {
      const templateData = fn(...args);
      mutate(templateData);
    };

  const action = <Args extends unknown[]>(
    fn: (...args: Args) => TemplateData,
  ) => withMutate(fn);

  return {
    uploadData: action(uploadData),
    deleteData: action(deleteData),
  };
}

function useMutateTemplateData() {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (templateData: TemplateData) => {
      return await saveTemplateData(templateData);
    },
    onMutate: (templateData) => {
      const key = templateDataQuery(templateData.id).queryKey;
      client.setQueryData(key, templateData);
    },
  });

  return { ...mutation };
}
