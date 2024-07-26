import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ElementType, Template, TemplateElement, saveTemplate } from "./template";
import { templateQuery } from "./templateQueries";
import { moveArrayItem, updateArrayItemById } from "utils/arrays";
import { OnMoveElement } from "./Template/Template";

export type SaveTemplatePropertiesFunction = (size: {
  templateName: Template["templateName"];
  width: Template["width"];
  height: Template["height"];
  units: Template["units"];
}) => void;

type UseTemplate = {
  saveTemplateProperties: SaveTemplatePropertiesFunction;
  addElement: (element: TemplateElement) => void;
  updateElementFontSize: (elementId: string, fontSize: number) => void;
  updateElementFontFamily: (elementId: string, fontFamily: string) => void;
  updateElementFontColour: (elementId: string, color: string | undefined) => void;
  updateElementDataHeader: (elementId: string, dataHeader: string) => void;
  rearrangeElementOrder: (elementId: string, newIndex: number) => void;
  setElementWidth: (elementId: string, width: number) => void;
  moveElement: (...params: Parameters<OnMoveElement>) => void;
  deleteElement: (elementId: string) => void;
};

export function useTemplateOperations(template: Template): UseTemplate {
  const { mutate } = useMutateTemplate();

  const saveTemplateProperties = (values: Parameters<SaveTemplatePropertiesFunction>[0]) => {
    const { templateName, height, width, units } = values;
    return {
      ...template,
      templateName,
      height,
      width,
      units,
    };
  };

  const addElement = (element: TemplateElement) => {
    return {
      ...template,
      elements: [element, ...template.elements],
    };
  };

  const updateElementFontSize = (elementId: string, fontSize: number): Template => {
    const element = getElement(elementId, "text");
    return {
      ...template,
      elements: updateArrayItemById(template.elements, elementId, { ...element, fontSize }),
    };
  };

  const updateElementFontFamily = (elementId: string, fontFamily: string) => {
    const element = getElement(elementId, "text");
    return {
      ...template,
      elements: updateArrayItemById(template.elements, elementId, { ...element, fontFamily }),
    };
  };

  const updateElementFontColour = (elementId: string, color: string | undefined) => {
    const element = getElement(elementId, "text");
    return {
      ...template,
      elements: updateArrayItemById(template.elements, elementId, { ...element, color }),
    };
  };

  const updateElementDataHeader = (elementId: string, dataHeader: string) => {
    const element = getElement(elementId, "text");
    return {
      ...template,
      elements: updateArrayItemById(template.elements, elementId, { ...element, dataHeader }),
    };
  };

  const rearrangeElementOrder = (elementId: string, newIndex: number) => {
    const oldIndex = template.elements.findIndex(el => el.id === elementId);
    if (oldIndex === -1)
      throw new Error("Could not find Template Element with id: " + elementId);
    return {
      ...template,
      elements: moveArrayItem(template.elements, oldIndex, newIndex),
    };
  };

  const setElementWidth = (elementId: string, width: number) => {
    const element = template.elements.find(el => el.id === elementId);
    if (!element) throw new Error("Could not find Template Element with id: " + elementId);
    if (!("width" in element))
      throw new Error("Can not set element width on element of type: " + element.type);
    return {
      ...template,
      elements: updateArrayItemById(template.elements, elementId, { ...element, width }),
    };
  };

  const moveElement = (elementId: string, delta: { top: number; left: number }) => {
    return {
      ...template,
      elements: template.elements.map(el => {
        if (el.id !== elementId) return el;
        return {
          ...el,
          top: el.top + delta.top,
          left: el.left + delta.left,
        };
      }),
    };
  };

  const deleteElement = (elementId: string) => {
    return {
      ...template,
      elements: template.elements.filter(el => el.id !== elementId),
    };
  };

  const withMutate =
    <Args extends unknown[]>(fn: (...args: Args) => Template) =>
    (...args: Args) => {
      const template = fn(...args);
      mutate(template);
    };

  const withHistory =
    <Args extends unknown[]>(
      fn: (...args: Args) => Template,
      direction?: "back" | "forward"
    ) =>
    (...args: Args) => {
      const { history, future } = handleHistory(direction);
      const newTemplate = fn(...args);
      return { ...newTemplate, history, future };
    };

  const action = <Args extends unknown[]>(fn: (...args: Args) => Template) =>
    withMutate(withHistory(fn));

  return {
    saveTemplateProperties: action(saveTemplateProperties),
    addElement: action(addElement),
    updateElementFontSize: action(updateElementFontSize),
    updateElementFontFamily: action(updateElementFontFamily),
    updateElementFontColour: action(updateElementFontColour),
    updateElementDataHeader: action(updateElementDataHeader),
    rearrangeElementOrder: action(rearrangeElementOrder),
    setElementWidth: action(setElementWidth),
    moveElement: action(moveElement),
    deleteElement: action(deleteElement),
  };

  function handleHistory(direction?: "back" | "forward"): Template {
    const { history, future, ...initialTemplate } = template;
    if (direction === "back") {
      const newHistory = [...history];
      const mostRecentItem = newHistory.pop();
      if (!mostRecentItem) throw new Error("Can't undo, invalid history stack");
      const newFuture = [initialTemplate, ...future];
      return { ...mostRecentItem, history: [...history], future: newFuture };
    }
    if (direction === "forward") {
      const newFuture = [...future];
      const nextItem = newFuture.shift();
      if (!nextItem) throw new Error("Can't redo, invalid future stack");
      const newHistory = [...history, initialTemplate];
      return { ...nextItem, history: newHistory, future: newFuture };
    }

    const newHistory = [...history, initialTemplate].slice(-10);
    const newFuture = [] as Template[];
    return { ...initialTemplate, history: newHistory, future: newFuture };
  }

  function getElement<T extends ElementType>(
    id: string,
    type: T
  ): Extract<TemplateElement, { type: T }> {
    const element = template.elements.find(element => element.id === id);
    if (!element) throw new Error("Can't find element with ID: " + id);
    if (element.type !== type)
      throw new Error("Can't change font size on element of type: " + element.type);
    return element as Extract<TemplateElement, { type: T }>;
  }
}

function useMutateTemplate() {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (template: Template) => {
      console.log("Mutation function");
      return await saveTemplate(template);
    },
    onMutate: template => {
      console.log("On mutate function", template.elements);
      const key = templateQuery(template.id).queryKey;
      client.setQueryData(key, template);
    },
  });

  return { ...mutation };
}

export default useMutateTemplate;
