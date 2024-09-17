import { Outlet, useParams } from "react-router";
import RibbonControls from "./controls/ribbonControls";
import { TemplateProvider } from "./templateContext";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { templateQuery } from "./templateQueries";
import { templateDataQuery } from "features/templateData/templateDataQueries";
import { TemplateDataProvider } from "features/templateData/TemplateDataContext";

function ViewTemplate() {
  const { templateId } = useParams<{ templateId: string }>();
  const { data: template } = useSuspenseQuery(templateQuery(templateId!));
  const { data: templateData } = useQuery(templateDataQuery(templateId!));

  return (
    <TemplateProvider template={template}>
      <TemplateDataProvider templateData={templateData}>
        <RibbonControls />
        <Outlet />
      </TemplateDataProvider>
    </TemplateProvider>
  );
}

export default ViewTemplate;
