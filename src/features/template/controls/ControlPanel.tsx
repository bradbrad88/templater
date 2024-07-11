import { useState } from "react";
import { useTemplate } from "../useTemplateContext";
import { TemplateSidebarProvider } from "../templateSidebarContext";
import SetSizeControl from "./SizeControls";
import ElementsControl from "./ElementsControl";
import Tabs from "../../../common/Tabs";

type ActiveControl = "size" | "elements";

const tabs: Array<{ name: string; href: ActiveControl }> = [
  { name: "Template", href: "size" },
  { name: "Elements", href: "elements" },
];

function ControlPanel() {
  const templateContext = useTemplate();
  const [activeControl, setActiveControl] = useState<ActiveControl>("size");

  const tabsCurrent = tabs.map(tab => ({
    ...tab,
    current: activeControl === tab.href,
  }));

  const onTabChange = (val: string) => {
    setActiveControl(val as ActiveControl);
  };

  if (!templateContext.template) return null;

  return (
    <TemplateSidebarProvider {...templateContext} template={templateContext.template}>
      <div className="w-full p-4">
        <div className="p-3 border-b-[1px] border-zinc-300 w-full">
          <Tabs tabs={tabsCurrent} onChange={onTabChange} />
        </div>
        {activeControl === "size" && <SetSizeControl />}
        {activeControl === "elements" && <ElementsControl />}
      </div>
    </TemplateSidebarProvider>
  );
}

export default ControlPanel;
