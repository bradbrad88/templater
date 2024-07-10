import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTemplate } from "../useTemplateContext";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../../common/Form";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import SelectMenu from "../../../common/SelectMenu";

const sizeSchema = z.object({
  width: z.coerce.number().gt(0),
  height: z.coerce.number().gt(0),
  units: z.string(),
});
type SizeSchema = z.infer<typeof sizeSchema>;

const units = [
  { id: "mm", value: "Millimetres", factor: 1 },
  { id: "in", value: "Inches", factor: 0.0393701 },
  { id: "cm", value: "Centimetres", factor: 0.1 },
] as const;

function SetSizeControl() {
  const { template, setHeight, setWidth, setUnits } = useTemplate();

  const form = useForm<SizeSchema>({
    resolver: zodResolver(sizeSchema),
    defaultValues: { width: template.width, height: template.height, units: "mm" },
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
    setWidth(values.width);
    setHeight(values.height);
    setUnits(values.units);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <fieldset className="grid grid-cols-3 w-full grid-rows-1 gap-2">
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
        </fieldset>
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}

export default SetSizeControl;

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
