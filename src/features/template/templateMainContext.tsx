import React, { createContext } from "react";
import { Template } from "./template";
import { PublicTemplateContext } from "./templateContext";

interface TemplateMainContext extends Omit<PublicTemplateContext, "load"> {
  template: Template;
}

interface Props extends TemplateMainContext {
  children?: React.ReactNode;
}

const Context = createContext<TemplateMainContext | null>(null);

export const TemplateMainProvider = (props: Props) => {
  return <Context.Provider value={{ ...props }}>{props.children}</Context.Provider>;
};

export default Context;
