import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTemplateSidebar } from "../useTemplateContext";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../../common/Form";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import SelectMenu from "../../../common/SelectMenu";
import { unitSchema } from "../template";

const sizeSchema = z.object({
  templateName: z.string().min(2),
  width: z.coerce.number().gt(0),
  height: z.coerce.number().gt(0),
  units: unitSchema,
});
type SizeSchema = z.infer<typeof sizeSchema>;

const units = [
  { id: "mm", value: "mm", factor: 1 },
  { id: "cm", value: "cm", factor: 0.1 },
  { id: "in", value: "in", factor: 0.0393701 },
] as const;

function TemplatePropertiesControl() {
  const { template, saveTemplateProperties } = useTemplateSidebar();

  const form = useForm<SizeSchema>({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      width: template.width,
      height: template.height,
      units: "mm",
      templateName: template.templateName,
    },
  });
  const normalisedValues = normalise(form.getValues());

  useEffect(() => {
    const sub = form.watch((value, { name, type }) => {
      if (!(name === "units" && type === "change")) return;
      if (!value.height) return;
      if (!value.width) return;
      const unit = units.find(unit => value.units === unit.id);
      if (!unit) throw new Error("Unit type not found: " + value.units);
      const newHeight = normalisedValues.height * unit.factor;
      const newWidth = normalisedValues.width * unit.factor;

      form.setValue("height", newHeight);
      form.setValue("width", newWidth);
    });
    return () => sub.unsubscribe();
  }, [form, normalisedValues]);

  const onSubmit = (values: SizeSchema) => {
    saveTemplateProperties(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mt-4">
        <fieldset className="w-full">
          <FormField
            name="templateName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template name</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
              </FormItem>
            )}
          />
        </fieldset>
        <hr className="border-zinc-300" />
        <fieldset className="w-full">
          <div className="grid grid-cols-[minmax(0,_7fr),_minmax(0,_5fr)] gap-5">
            <div className="flex flex-col gap-3">
              <FormField
                name="width"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" inputMode="decimal" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="height"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" inputMode="decimal" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="units"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Units</FormLabel>
                  <FormControl>
                    <SelectMenu options={[...units]} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </fieldset>
        <Button disabled={!form.formState.isDirty} type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}

export default TemplatePropertiesControl;

function normalise(values: { height: number; width: number; units: string }): {
  height: number;
  width: number;
  units: string;
} {
  const unit = units.find(unit => unit.id === values.units);
  if (!unit) throw new Error("Unit type not found: " + values.units);
  const height = values.height / unit.factor;
  const width = values.width / unit.factor;
  return {
    width,
    height,
    units: values.units,
  };
}
