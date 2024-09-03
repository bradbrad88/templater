import { useState } from "react";
import { Link } from "react-router-dom";
import { useTemplateData } from "features/templateData/useTemplateData";
import useToggleModal from "src/hooks/useToggleModal";
import PropertiesControl from "./TemplatePropertiesControls";
import ElementsControl from "./ElementsControl";
import LayersControl from "./LayersControl";
import Tabs from "common/Tabs";
import Button from "common/Button";

type ActiveControl = "size" | "elements" | "layers";

const tabs: Array<{ name: string; href: ActiveControl }> = [
  { name: "Template", href: "size" },
  { name: "Layers", href: "layers" },
  { name: "Create", href: "elements" },
];

function EditorControls() {
  const [activeControl, setActiveControl] = useState<ActiveControl>("size");
  const { templateData } = useTemplateData();

  const tabsCurrent = tabs.map(tab => ({
    ...tab,
    current: activeControl === tab.href,
  }));

  const onTabChange = (val: string) => {
    setActiveControl(val as ActiveControl);
  };

  return (
    <div className="w-full p-4 mt-2">
      {templateData ? (
        <Link to={"preview"}>
          <Button className="w-full font-bold">Preview</Button>
        </Link>
      ) : (
        <LoadSpreadsheet />
      )}
      <div className="pt-4 pb-1 border-b-[1px] border-zinc-300 w-full mb-4">
        <Tabs tabs={tabsCurrent} onChange={onTabChange} />
      </div>
      {activeControl === "size" && <PropertiesControl />}
      {activeControl === "elements" && <ElementsControl />}
      {activeControl === "layers" && <LayersControl />}
    </div>
  );
}

function LoadSpreadsheet() {
  const [_, setOpen] = useToggleModal("load-spreadsheet");
  return (
    <Button onClick={() => setOpen(true)} className="w-full">
      Load spreadsheet to preview
    </Button>
  );
}

export default EditorControls;
