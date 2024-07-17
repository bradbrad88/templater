import { z } from "zod";

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
export const actionSchema = z.object({
  action: z.string(),
  params: z.unknown().array(),
});

export const templateSchema = z.object({
  id: z.string(),
  templateName: z.string(),
  width: z.number().gt(0),
  height: z.number().gt(0),
  units: unitSchema,
  elements: elementSchema.array(),
  changeLog: actionSchema.array(),
});

export type Template = z.infer<typeof templateSchema>;

export type ActionType = z.infer<typeof actionTypeSchema>;
export type Action = z.infer<typeof actionSchema>;

export type TemplateElement = z.infer<typeof elementSchema>;

export type TextElement = z.infer<typeof textElementSchema>;
export type ImageElement = z.infer<typeof imageElementSchema>;
