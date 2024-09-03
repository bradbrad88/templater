import { createContext, useEffect, useState } from "react";
import { TemplateData } from "./templateData";

type ContextType = {
  data: DataSource | null;
  uploadData: (data: DataSource) => void;
  removeData: () => void;
};

type Props = {
  children?: React.ReactNode;
};

const Context = createContext<ContextType | null>(null);

export const TemplateDataProvider = ({ templateData, children }: Props) => {
  const operations = useTemplateDataOperations(templateData);
  return (
    <Context.Provider value={{ templateData, ...operations }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
