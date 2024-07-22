import { z } from "zod";
import db from "src/config/db";
import NotFoundError from "src/errors/NotFoundError";

export const templateStorageKey = "templates";

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

export const imageElementSchema = z
  .object({
    type: z.literal("image"),
    src: z.string(),
    width: z.number(),
  })
  .and(elementBase);

export const elementSchema = z.union([textElementSchema, imageElementSchema], {
  message: "Template schema missing elements array",
});

export const unitSchema = z.union([z.literal("mm"), z.literal("cm"), z.literal("in")]);

export const actionTypeSchema = z.union([z.literal("setSize"), z.literal("setTemplateName")]);

export const templateSchema = z.object({
  id: z.string(),
  templateName: z.string(),
  width: z.number().gt(0),
  height: z.number().gt(0),
  units: unitSchema,
  elements: elementSchema.array(),
});

export const templateWithHistorySchema = templateSchema.extend({
  history: templateSchema.array(),
  future: templateSchema.array(),
});

export type TemplateFilters = {
  templateName?: string;
};

export type Template = z.infer<typeof templateWithHistorySchema>;
export type ActionType = z.infer<typeof actionTypeSchema>;
export type TemplateElement = z.infer<typeof elementSchema>;
export type TextElement = z.infer<typeof textElementSchema>;
export type ImageElement = z.infer<typeof imageElementSchema>;
export type ElementType = TemplateElement["type"];

export const getTemplateById = async (id: string) => {
  const template = await db.getItemById("templates", id);
  if (!template) throw new NotFoundError();
  const validatedTemplate = templateWithHistorySchema.parse(template);
  return validatedTemplate;
};

export const getTemplateList = async (_: TemplateFilters) => {
  const templates = await db.getAll("templates");
  const validatedTemplates = templateWithHistorySchema.array().parse(templates);
  return validatedTemplates;
};

export const saveTemplate = async (template: Template) => {
  await db.writeItem("templates", template);
};
