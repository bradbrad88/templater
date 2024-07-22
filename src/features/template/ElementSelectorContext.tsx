import React, { createContext, useState } from "react";

type ContextType = {
  selectedElementId: string | null;
  selectElement: (elementId: string) => void;
  deselect: () => void;
};

type Props = {
  children?: React.ReactNode;
};

const Context = createContext<ContextType | null>(null);

export const ElementSelectorProvider = ({ children }: Props) => {
  const [selectedElementId, setSeletedElementId] = useState<string | null>(null);

  const deselect = () => {
    setSeletedElementId(null);
  };

  const selectElement = (elementId: string) => {
    setSeletedElementId(elementId);
  };

  return (
    <Context.Provider value={{ selectedElementId, selectElement, deselect }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
