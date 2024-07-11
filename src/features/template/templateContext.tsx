import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Action, Template, templateSchema, templateStorageKey } from "./template";

export type SaveTemplatePropertiesFunction = (size: {
  templateName: Template["templateName"];
  width: Template["width"];
  height: Template["height"];
  units: Template["units"];
}) => void;

export type TemplateContext = {
  saveTemplateProperties: SaveTemplatePropertiesFunction;
  load: (id: string) => void;
  unload: () => void;
  template: Template | null;
};

export type TemplateElement = TextElement | ImageElement;

export type PublicTemplateContext = Omit<TemplateContext, "load" | "unload">;

export interface TextElement extends React.CSSProperties {
  type: "text";
  value: string;
}

export type TemplateSaveFunction = (template: Template) => void;

export interface ImageElement extends React.CSSProperties {
  type: "image";
  src: string;
}

const Context = createContext<TemplateContext | null>(null);

export const TemplateProvider = ({ children }: { children?: React.ReactNode }) => {
  const [id, setId] = useState<string | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [units, setUnits] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState<string | null>(null);
  const [newActions, setNewActions] = useState<Template["changeLog"]>([]);
  const changeLog = useRef<Template["changeLog"] | null>(null);

  const { success, data } = templateSchema.safeParse({
    id,
    width,
    height,
    units,
    templateName,
    changeLog: [],
  });

  const template = success ? data : null;

  const save = useCallback(
    (template: Template) => {
      const validatedTemplate = templateSchema.parse(template);
      const actions = [...newActions, ...changeLog.current!];
      console.log("New actions", [...newActions]);
      console.log("Existing Actions", [...changeLog.current!]);
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
    const { height, width, id, units, templateName, changeLog: changeLogInput } = template;
    setId(id);
    setTemplateName(templateName);
    setHeight(height);
    setWidth(width);
    setUnits(units);
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

  const withAction =
    <T extends unknown[]>(fn: (...args: T) => void) =>
    (...args: T) => {
      fn(...args);
      addAction({ action: fn.name, params: args });
    };

  const addAction = (action: Action) => {
    setNewActions(prev => [...prev, action]);
  };

  return (
    <Context.Provider
      value={{
        saveTemplateProperties: withAction(saveTemplateProperties),
        template: template,
        load,
        unload,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
