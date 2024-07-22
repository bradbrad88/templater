import { contextFactory } from "../../utils/contexts";
import context from "./templateContext";
import elementContext from "./ElementSelectorContext";

export const useTemplate = contextFactory(context);
export const useElement = contextFactory(elementContext);
