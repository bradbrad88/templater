import { createContext } from "react";
import { Template } from "./template";
import { useTemplateOperations } from "./useMutateTemplate";

export type SaveTemplatePropertiesFunction = (size: {
  templateName: Template["templateName"];
  width: Template["width"];
  height: Template["height"];
  units: Template["units"];
}) => void;

type TemplateMutations = ReturnType<typeof useTemplateOperations>;

export interface TemplateContext extends TemplateMutations {
  template: Template;
}

export type PublicTemplateContext = Omit<TemplateContext, "load" | "unload" | "error">;

export type TemplateSaveFunction = (template: Template) => void;

const Context = createContext<TemplateContext | null>(null);

export const TemplatePersistenceProvider = () => {};

export const TemplateProvider = ({
  children,
  template,
}: {
  template: Template;
  children?: React.ReactNode;
}) => {
  const operations = useTemplateOperations(template);

  return (
    <Context.Provider
      value={{
        ...operations,
        template,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
