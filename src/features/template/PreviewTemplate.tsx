import { useState } from "react";
import { createPortal } from "react-dom";
import { Navigate } from "react-router-dom";
import { useImportData } from "features/importData/useImportData";
import { useTemplate } from "./useTemplateContext";
import Template from "./Template/Template";
import { ChevronLeftIcon, ChevronRightIcon } from "common/icons";

function PreviewTemplate() {
  const { data } = useImportData();
  const { template } = useTemplate();
  const [row, setRow] = useState(0);

  if (!data) return <Navigate to={"../"} relative="route" />;
  if (!template) return <Navigate to={"../"} relative="route" />;

  const headers = data.headers;

  const dataMap = headers.reduce(
    (map, header, idx) => {
      const key = header?.value || "";
      map[key] = idx;
      return map;
    },
    {} as Record<string, number>
  );

  const getRowData = (rowIdx: number) =>
    headers.reduce(
      (map, header) => {
        const row = data.bodyData[rowIdx];
        const key = header?.value || "";
        const headerIdx = dataMap[key];
        map[key] = row[headerIdx]?.value || "";
        return map;
      },
      {} as Record<string, string>
    );

  const onBack = () => {
    const newRow = row - 1;
    if (newRow < 0) return setRow(data.bodyData.length - 1);
    setRow(newRow);
  };

  const onForward = () => {
    const newRow = row + 1;
    if (newRow > data.bodyData.length - 1) return setRow(0);
    setRow(newRow);
  };

  return (
    <>
      <div className="flex items-center w-full justify-center mt-20">
        <ChevronLeftIcon size={36} onClick={onBack} />
        <Template template={template} data={getRowData(row)} />
        <ChevronRightIcon size={36} onClick={onForward} />
      </div>
      {createPortal(
        <div className="flex-wrap hidden print:flex">
          {data.bodyData.map((_, idx) => (
            <div
              key={idx}
              className="break-inside-avoid break-inside-avoid-columnn w-fit grow-0 shrink-0"
            >
              <Template template={template} data={getRowData(idx)} />
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

export default PreviewTemplate;
