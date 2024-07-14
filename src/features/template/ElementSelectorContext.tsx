import React, { createContext, useEffect, useState } from "react";
import { TemplateElement } from "./template";
import { useTemplate } from "./useTemplateContext";

type ContextType = {
  selectedElement: TemplateElement | null;
  selectElement: (element: TemplateElement) => void;
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
  const [selectedElement, setSelectedElement] = useState<TemplateElement | null>(null);

  useEffect(() => {
    const findElement = (id: string): TemplateElement => {
      const element = elements?.find(element => element.id === id);
      if (!element) throw new Error("No element exists with id: " + id);
      return element;
    };
    if (!selectedElementId && selectedElement) return setSelectedElement(null);
    if (!selectedElementId) return;
    const foundElement = findElement(selectedElementId);
    if (selectedElement !== foundElement) return setSelectedElement(foundElement);
  }, [selectedElementId, selectedElement, elements]);

  const deselect = () => {
    setSeletedElementId(null);
  };

  const selectElement = (element: TemplateElement) => {
    setSeletedElementId(element.id);
  };

  return (
    <Context.Provider value={{ selectedElement, selectElement, deselect }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
