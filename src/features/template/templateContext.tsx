import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  Action,
  Template,
  TemplateElement,
  templateSchema,
  templateStorageKey,
} from "./template";
import { OnMoveElement } from "./Template/Template";

export type SaveTemplatePropertiesFunction = (size: {
  templateName: Template["templateName"];
  width: Template["width"];
  height: Template["height"];
  units: Template["units"];
}) => void;

export type TemplateContext = {
  saveTemplateProperties: SaveTemplatePropertiesFunction;
  addElement: (element: TemplateElement) => void;
  changeElementFontSize: (elementId: string, fontSize: number) => void;
  changeElementDataHeader: (elementId: string, dataHeader: string) => void;
  moveElement: OnMoveElement;
  load: (id: string) => void;
  unload: () => void;
  template: Template | null;
  error: Error | null;
};

export type PublicTemplateContext = Omit<TemplateContext, "load" | "unload" | "error">;

export type TemplateSaveFunction = (template: Template) => void;

const Context = createContext<TemplateContext | null>(null);

export const TemplateProvider = ({ children }: { children?: React.ReactNode }) => {
  const [id, setId] = useState<string | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [units, setUnits] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState<string | null>(null);
  const [elements, setElements] = useState<TemplateElement[] | null>(null);

  const [newActions, setNewActions] = useState<Template["changeLog"]>([]);

  const changeLog = useRef<Template["changeLog"] | null>(null);

  const {
    success,
    data,
    error: zodError,
  } = templateSchema.safeParse({
    id,
    width,
    height,
    units,
    templateName,
    elements,
    changeLog: [],
  });

  const error = id ? zodError || null : null;

  const template = success ? data : null;

  const save = useCallback(
    (template: Template) => {
      const validatedTemplate = templateSchema.parse(template);
      const actions = [...newActions, ...changeLog.current!];
      setNewActions([]);
      changeLog.current = actions;
      validatedTemplate.changeLog = actions;
      const existingTemplates = JSON.parse(
        localStorage.getItem(templateStorageKey) || "{}"
      ) as Record<string, Template>;
      existingTemplates[template.id] = validatedTemplate;
      const str = JSON.stringify(existingTemplates);
      localStorage.setItem(templateStorageKey, str);
    },
    [newActions]
  );

  const load = useCallback((templateId: string) => {
    const templates = JSON.parse(localStorage.getItem(templateStorageKey) || "[]");
    const validatedTemplates = z.record(z.string(), templateSchema).parse(templates);
    const template = validatedTemplates[templateId];
    if (!template) throw new Error(`Template with ID: '${templateId}' not found`);
    const {
      height,
      width,
      id,
      units,
      templateName,
      changeLog: changeLogInput,
      elements,
    } = template;
    setId(id);
    setTemplateName(templateName);
    setHeight(height);
    setWidth(width);
    setUnits(units);
    setElements(elements);
    changeLog.current = changeLogInput;
  }, []);

  const unload = useCallback(() => {
    setId(null);
    setNewActions([]);
  }, []);

  useEffect(() => {
    if (template && newActions.length > 0) save(template);
  }, [template, newActions, save]);

  const saveTemplateProperties = (values: Parameters<SaveTemplatePropertiesFunction>[0]) => {
    const { templateName, height, width, units } = values;
    setTemplateName(templateName);
    setWidth(width);
    setHeight(height);
    setUnits(units);
  };

  // Data Header is what links the text to the data column
  const changeElementDataHeader = (elementId: string, dataHeader: string) => {
    if (!elements) throw new Error("No template found");
    const element = elements.find(element => element.id === elementId);
    if (!element) throw new Error("Can't find element with ID: " + elementId);
    if (!("dataHeader" in element))
      throw new Error("Can't change font size on element of type: " + element.type);
    setElements(elements =>
      elements!.map(element => {
        if (element.id !== elementId) return element;
        return {
          ...element,
          dataHeader,
        };
      })
    );
  };

  const changeElementFontSize = (elementId: string, fontChange: number) => {
    if (!elements) throw new Error("No template found");
    const element = elements.find(element => element.id === elementId);
    if (!element) throw new Error("Can't find element with ID: " + elementId);
    if (!("fontSize" in element))
      throw new Error("Can't change font size on element of type: " + element.type);
    const newFontSize = element.fontSize + fontChange;
    setElements(elements =>
      elements!.map(element => {
        if (element.id !== elementId) return element;
        return {
          ...element,
          fontSize: newFontSize,
        };
      })
    );
  };

  const moveElement: OnMoveElement = (elementId, delta) => {
    if (!elements) return;
    setElements(elements =>
      elements!.map(el => {
        if (el.id !== elementId) return el;
        return {
          ...el,
          top: delta.top + el.top,
          left: delta.left + el.left,
        };
      })
    );
  };

  const addElement = (element: TemplateElement) => {
    setElements(prev => [...prev!, element]);
  };

  const withAction =
    <T extends unknown[]>(fn: (...args: T) => void) =>
    (...args: T) => {
      try {
        fn(...args);
        addAction({ action: fn.name, params: args });
      } catch (error) {
        console.log(error);
      }
    };

  const addAction = (action: Action) => {
    setNewActions(prev => [...prev, action]);
  };

  return (
    <Context.Provider
      value={{
        saveTemplateProperties: withAction(saveTemplateProperties),
        addElement: withAction(addElement),
        changeElementFontSize: withAction(changeElementFontSize),
        changeElementDataHeader: withAction(changeElementDataHeader),
        moveElement: withAction(moveElement),
        template: template,
        load,
        unload,
        error,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
