import { createContext } from "react";
import { TemplateData } from "./templateData";
import { useTemplateDataOperations } from "./useTemplateDataOperations";

type TemplateMutations = ReturnType<typeof useTemplateDataOperations>;

interface ContextType extends TemplateMutations {
  templateData: TemplateData | null | undefined;
}

type Props = {
  templateData: TemplateData | null | undefined;
  children?: React.ReactNode;
};

const Context = createContext<ContextType | null>(null);

export const TemplateDataProvider = ({ templateData, children }: Props) => {
  const operations = useTemplateDataOperations(templateData);
  return (
    <Context.Provider value={{ templateData, ...operations }}>{children}</Context.Provider>
  );
};

export default Context;
