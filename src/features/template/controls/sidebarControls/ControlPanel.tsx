import { useState } from "react";
import { useTemplate } from "../../useTemplateContext";
import { TemplateSidebarProvider } from "../../templateSidebarContext";
import PropertiesControl from "./TemplatePropertiesControls";
import ElementsControl from "./ElementsControl";
import Tabs from "common/Tabs";
import LayersControl from "./LayersControl";

type ActiveControl = "size" | "elements" | "layers";

const tabs: Array<{ name: string; href: ActiveControl }> = [
  { name: "Template", href: "size" },
  { name: "Layers", href: "layers" },
  { name: "Create", href: "elements" },
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

  if (templateContext.error) throw templateContext.error;
  if (!templateContext.template) return null;

  return (
    <TemplateSidebarProvider {...templateContext} template={templateContext.template}>
      <div className="w-full p-4">
        <div className="p-3 border-b-[1px] border-zinc-300 w-full">
          <Tabs tabs={tabsCurrent} onChange={onTabChange} />
        </div>
        {activeControl === "size" && <PropertiesControl />}
        {activeControl === "elements" && <ElementsControl />}
        {activeControl === "layers" && <LayersControl />}
      </div>
    </TemplateSidebarProvider>
  );
}

export default ControlPanel;
