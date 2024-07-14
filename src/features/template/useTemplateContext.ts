import { contextFactory } from "../../utils/contexts";
import context from "./templateContext";
import sidebarContext from "./templateSidebarContext";
import mainContext from "./templateMainContext";
import elementContext from "./ElementSelectorContext";

export const useTemplate = contextFactory(context);
export const useTemplateMain = contextFactory(mainContext);
export const useTemplateSidebar = contextFactory(sidebarContext);
export const useElement = contextFactory(elementContext);
