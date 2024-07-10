import { useContext } from "react";

export const contextFactory = <T>(context: React.Context<T>) => {
  return () => {
    const contextInstance = useContext(context);
    if (!contextInstance) throw new Error("Context hook must be used inside its provider");
    return { ...contextInstance };
  };
};
