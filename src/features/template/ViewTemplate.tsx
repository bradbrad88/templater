import { Outlet, useParams } from "react-router";
import RibbonControls from "./controls/ribbonControls";
import { TemplateProvider } from "./templateContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import { templateQuery } from "./templateQueries";

function ViewTemplate() {
  const { templateId } = useParams<{ templateId: string }>();
  const { data } = useSuspenseQuery(templateQuery(templateId!));

  return (
    <TemplateProvider template={data}>
      <RibbonControls />
      <Outlet />
    </TemplateProvider>
  );
}

export default ViewTemplate;
