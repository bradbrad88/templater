import React, { createContext, useState } from "react";
import { TemplateElement } from "./template";
import { useTemplate } from "./useTemplateContext";

type ContextType = {
  selectedElement: TemplateElement | null;
  selectElement: (elementId: string) => void;
  deselect: () => void;
};

type Props = {
  children?: React.ReactNode;
};

const Context = createContext<ContextType | null>(null);

export const ElementSelectorProvider = ({ children }: Props) => {
  const { template } = useTemplate();
  const elements = template?.elements;
  const [selectedElementId, setSeletedElementId] = useState<string | null>(null);

  const deselect = () => {
    setSeletedElementId(null);
  };

  const selectElement = (elementId: string) => {
    setSeletedElementId(elementId);
  };

  const selectedElement = elements?.find(el => el.id === selectedElementId) || null;

  return (
    <Context.Provider value={{ selectedElement, selectElement, deselect }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
