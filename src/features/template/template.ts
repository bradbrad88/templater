import { z } from "zod";
import db from "src/config/db";
import NotFoundError from "src/errors/NotFoundError";

export const templateStorageKey = "templates";

export class TemplateImage {
  public file: File;
  constructor(file: File) {
    this.file = file;
  }

  toString() {
    return URL.createObjectURL(this.file).toString();
  }
}

export const elementBase = z.object({
  id: z.string(),
  top: z.number(),
  left: z.number(),
});

export const textElementSchema = z
  .object({
    type: z.literal("text"),
    dataHeader: z.string(),
    fontSize: z.number(),
    fontFamily: z.string().optional(),
    color: z.string().optional(),
  })
  .and(elementBase);

export const serialisedImageElementSchema = z
  .object({
    type: z.literal("image"),
    image: z.object({ file: z.instanceof(File) }),
    width: z.number(),
  })
  .and(elementBase);

export const imageElementSchema = z
  .object({
    type: z.literal("image"),
    image: z.instanceof(TemplateImage),
    width: z.number(),
  })
  .and(elementBase);

export const elementSchema = z.union([textElementSchema, imageElementSchema], {
  message: "Template schema missing elements array",
});

export const serialisedElementSchema = z.union([
  textElementSchema,
  serialisedImageElementSchema,
]);

export const unitSchema = z.union([z.literal("mm"), z.literal("cm"), z.literal("in")]);

export const templateSchema = z.object({
  id: z.string(),
  templateName: z.string(),
  width: z.number().gt(0),
  height: z.number().gt(0),
  units: unitSchema,
  elements: elementSchema.array(),
});

export const serialisedTemplateSchema = templateSchema.extend({
  elements: serialisedElementSchema.array(),
});

export const templateWithHistorySchema = templateSchema.extend({
  history: templateSchema.array(),
  future: templateSchema.array(),
});

export const serialisedTemplateWithHistorySchema = serialisedTemplateSchema.extend({
  history: serialisedTemplateSchema.array(),
  future: serialisedTemplateSchema.array(),
});

export type TemplateFilters = {
  templateName?: string;
};

export type Template = z.infer<typeof templateWithHistorySchema>;
export type SerialisedTemplate = z.infer<typeof serialisedTemplateWithHistorySchema>;
export type TemplateElement = z.infer<typeof elementSchema>;
export type SerialisedTemplateElement = z.infer<typeof serialisedElementSchema>;
export type TextElement = z.infer<typeof textElementSchema>;
export type ImageElement = z.infer<typeof imageElementSchema>;
export type ElementType = TemplateElement["type"];

export const getTemplateById = async (id: string) => {
  const template = await db.getItemById("templates", id);
  if (!template) throw new NotFoundError();
  const validatedTemplate = serialisedTemplateWithHistorySchema.parse(template);
  return hydrateTemplate(validatedTemplate);
};

export const getTemplateList = async (_: TemplateFilters) => {
  const templates = await db.getAll("templates");
  const validatedTemplates = serialisedTemplateWithHistorySchema.array().parse(templates);
  return validatedTemplates.map(template => hydrateTemplate(template));
};

export const saveTemplate = async (template: Template) => {
  await db.writeItem("templates", template);
};

function hydrateTemplate(template: SerialisedTemplate): Template {
  const hydratedTemplate = {
    ...template,
    elements: template.elements.map(hydrateElements),
    future: template.future.map(futureItem => ({
      ...futureItem,
      elements: futureItem.elements.map(hydrateElements),
    })),
    history: template.history.map(historyItem => ({
      ...historyItem,
      elements: historyItem.elements.map(hydrateElements),
    })),
  };
  return hydratedTemplate;
}

function hydrateElements(element: SerialisedTemplateElement): TemplateElement {
  if (element.type === "image")
    return {
      ...element,
      image: new TemplateImage(element.image.file),
    };
  return element;
}
