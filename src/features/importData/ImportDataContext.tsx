import { createContext, useEffect, useState } from "react";
import { DataSource, dataSourceSchema, localStorageKey } from "./importData";

type ContextType = {
  data: DataSource | null;
  uploadData: (data: DataSource) => void;
};

type Props = {
  children?: React.ReactNode;
};

const Context = createContext<ContextType | null>(null);

export const ImportDataProvider = ({ children }: Props) => {
  const [data, setData] = useState<DataSource | null>(null);

  useEffect(() => {
    const store = localStorage.getItem(localStorageKey);
    if (!store) return;
    // const json = JSON.parse(store);

    const parsedData = dataSourceSchema.parse(JSON.parse(store));
    setData(parsedData);
  }, []);

  const uploadData = (data: DataSource) => {
    setData(data);
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  };

  return <Context.Provider value={{ data, uploadData }}>{children}</Context.Provider>;
};

export default Context;
