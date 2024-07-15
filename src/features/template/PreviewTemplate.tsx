import { useImportData } from "features/importData/useImportData";
import { Navigate } from "react-router";

function PreviewTemplate() {
  const { data } = useImportData();

  if (!data) return <Navigate to={"../"} relative="route" />;

  return <div>Preview</div>;
}

export default PreviewTemplate;
