import { useId, useState } from "react";
import { useImportData } from "features/importData/useImportData";
import { useTemplateMain } from "features/template/useTemplateContext";
import { TextElement } from "features/template/template";
import SelectMenu from "common/SelectMenu";
import Input from "common/Input";
import Label from "common/Label";
import { googleFonts } from "src/config/fonts";

function TextControls({ element }: { element: TextElement }) {
  return (
    <div className="flex flex-row items-end gap-6">
      <DataHeader element={element} />
      <FontSize element={element} />
      <FontSelection element={element} />
    </div>
  );
}

function DataHeader({ element }: { element: TextElement }) {
  const { data } = useImportData();
  const { changeElementDataHeader } = useTemplateMain();
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
    changeElementDataHeader(element.id, value);
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setDataHeader(e.target.value);
  };

  const onInputBlur = () => {
    if (dataHeader == null) return;
    changeElementDataHeader(element.id, dataHeader);
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
  const { changeElementFontSize } = useTemplateMain();

  const id = useId();

  const onFontSizeChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const fontSize = Number(e.target.value);
    if (isNaN(fontSize)) return;
    const change = fontSize - element.fontSize;
    changeElementFontSize(element.id, change);
  };

  return (
    <div className="w-24">
      <Label htmlFor={id}>Font size</Label>

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
  const { changeElementFontFamily } = useTemplateMain();
  const fonts = [...googleFonts];
  const id = useId();
  fonts.sort();
  const options = fonts.map(font => ({ id: font, value: font }));
  const onChange = (value: string) => {
    changeElementFontFamily(element.id, value);
  };
  return (
    <div className="w-48">
      <Label htmlFor={id}>Font</Label>
      <SelectMenu
        id={id}
        options={options}
        value={element.fontFamily}
        fontSelector
        onChange={onChange}
      />
    </div>
  );
}

export default TextControls;
