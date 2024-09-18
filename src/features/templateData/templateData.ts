import { z } from "zod";
import db from "src/config/db";

export const localStorageKey = "template-data";

export const headersSchema = z.union([
  z.object({ value: z.string() }),
  z.null(),
]);
export const bodySchema = z
  .union([z.object({ value: z.string() }), z.null()])
  .array();

export const templateDataSchema = z.object({
  id: z.string(),
  headers: headersSchema.array(),
  bodyData: bodySchema.array(),
  sourceName: z.string(),
  dateUploaded: z.coerce.date(),
});

export type Headers = z.infer<typeof headersSchema>;
export type BodyData = z.infer<typeof bodySchema>;
export type TemplateData = z.infer<typeof templateDataSchema>;

export async function saveTemplateData(templateData: DataSource) {
  await db.writeItem("templateData", templateData);
}

export async function getTemplateData(templateId: string) {
  const templateData = await db.getItemById("templateData", templateId);
  return templateDataSchema
    .nullish()
    .parse(templateData) as TemplateData | null;
}
