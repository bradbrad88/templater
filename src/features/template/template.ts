import { z } from "zod";

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
  changeLog: actionSchema.array(),
});

export type Template = z.infer<typeof templateSchema>;

export type ActionType = z.infer<typeof actionTypeSchema>;
export type Action = z.infer<typeof actionSchema>;

export const templateStorageKey = "templates";
