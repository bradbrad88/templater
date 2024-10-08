import { useId, useState } from "react";
import { googleFonts } from "src/config/fonts";
import { useImportData } from "features/importData/useImportData";
import { useTemplate } from "features/template/useTemplateContext";
import { TextElement } from "features/template/template";
import SelectMenu from "common/SelectMenu";
import Input from "common/Input";
import Label from "common/Label";

function TextControls({ element }: { element: TextElement }) {
  return (
    <div className="flex flex-row items-end gap-6">
      <DataHeader element={element} />
      <div className="flex gap-1 items-end">
        <FontSelection element={element} />
        <FontSize element={element} />
        <ColourSelection element={element} />
      </div>
    </div>
  );
}

function DataHeader({ element }: { element: TextElement }) {
  const { data } = useImportData();
  const { updateElementDataHeader } = useTemplate();
  const [showInput, setShowInput] = useState(false);

  const [dataHeader, setDataHeader] = useState<string | null>(null);

  const id = useId();

  const headerOptions = data?.headers
    .filter(header => header)
    .map(header => ({ id: header!.value, value: header!.value }))
    .concat(
      [{ id: element.dataHeader, value: element.dataHeader }].filter(
        el => !data.headers.some(a => a!.value === el.id)
      )
    );

  const onSelectChange = (value: string) => {
    updateElementDataHeader(element.id, value);
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setDataHeader(e.target.value);
  };

  const onInputBlur = () => {
    if (dataHeader == null) return;
    updateElementDataHeader(element.id, dataHeader);
    setDataHeader(null);
  };
  /*
  If a upload-data is present, user should be nudged towards using those values

  Should still be possible to free-text values as upload-data isn't strictly tied to a template

  If no upload-data is present, user can only free-text a value
  */

  const showSelect = data && !showInput;

  const label = "Data";

  return (
    <div className="flex flex-col w-44">
      <div className="relative">
        <Label htmlFor={id}>{label}</Label>
        <span
          onClick={() => setShowInput(!showInput)}
          className="absolute top-1 right-0 text-sm text-indigo-700 font-bold cursor-pointer"
        >
          {showInput ? "From data" : "Custom"}
        </span>
      </div>
      {showSelect ? (
        <SelectMenu
          id={id}
          options={headerOptions!}
          onChange={onSelectChange}
          value={dataHeader || element.dataHeader}
        />
      ) : (
        <>
          <Input
            id={id}
            value={dataHeader == null ? element.dataHeader : dataHeader}
            onChange={onInputChange}
            onBlur={onInputBlur}
          />
        </>
      )}
    </div>
  );
}

function FontSize({ element }: { element: TextElement }) {
  const { updateElementFontSize } = useTemplate();

  const id = useId();

  const onFontSizeChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const fontSize = Number(e.target.value);
    if (isNaN(fontSize)) return;
    updateElementFontSize(element.id, fontSize);
  };

  return (
    <div className="w-24">
      {/* <Label htmlFor={id}>Font size</Label> */}

      <Input
        id={id}
        type="number"
        inputMode="numeric"
        className="w-full"
        onChange={onFontSizeChange}
        value={element.fontSize}
      />
    </div>
  );
}

function FontSelection({ element }: { element: TextElement }) {
  const { updateElementFontFamily } = useTemplate();
  const fonts = [...googleFonts];
  const id = useId();
  fonts.sort();
  const options = fonts.map(font => ({ id: font, value: font }));
  const onChange = (value: string) => {
    updateElementFontFamily(element.id, value);
  };
  return (
    <div className="w-48">
      <Label htmlFor={id}>Font</Label>
      <SelectMenu
        id={id}
        options={options}
        value={element.fontFamily || ""}
        fontSelector
        onChange={onChange}
      />
    </div>
  );
}

function ColourSelection({ element }: { element: TextElement }) {
  const { updateElementFontColour } = useTemplate();
  const [colour, setColour] = useState(element.color);
  const id = useId();

  const onBlur: React.ChangeEventHandler<HTMLInputElement> = () => {
    console.log(colour);
    updateElementFontColour(element.id, colour);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const colour = e.target.value;
    setColour(colour);
  };

  return (
    <div className="block">
      {/* <Label htmlFor={id}>Font colour</Label> */}
      <input
        id={id}
        className="h-10 block border-[1px] border-zinc-400 rounded-lg outline-none p-1"
        type="color"
        onBlur={onBlur}
        onChange={onChange}
        value={element.color || "#000000"}
      />
    </div>
  );
}

export default TextControls;
