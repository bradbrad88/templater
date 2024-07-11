import React, { createContext } from "react";
import { Template } from "./template";

import type { PublicTemplateContext } from "./templateContext";

interface TemplateSidbarContext extends Omit<PublicTemplateContext, "load"> {
  template: Template;
}

const Context = createContext<TemplateSidbarContext | null>(null);

interface Props extends TemplateSidbarContext {
  children?: React.ReactNode;
}

export const TemplateSidebarProvider = (props: Props) => {
  return <Context.Provider value={{ ...props }}>{props.children}</Context.Provider>;
};

export default Context;
