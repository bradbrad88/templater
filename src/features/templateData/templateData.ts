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
  headers: headersSchema.array(),
  bodyData: bodySchema.array(),
  sourceName: z.string(),
  dateUploaded: z.coerce.date(),
});

export type Headers = z.infer<typeof headersSchema>;
export type BodyData = z.infer<typeof bodySchema>;
export type TemplateData = z.infer<typeof templateDataSchema>;
