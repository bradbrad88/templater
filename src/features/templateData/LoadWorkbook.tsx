import { useId, useState } from "react";
import { read, utils } from "xlsx";
import { useTemplateData } from "./useTemplateData";
import SelectMenu from "common/SelectMenu";
import Button from "common/Button";
import Label from "common/Label";

import type { WorkBook } from "xlsx";
import type { BodyData, TemplateData, Headers } from "./templateData";

function LoadWorkbook({ close = () => {} }: { close?: () => void }) {
  const [dataSource, setTemplateData] = useState<TemplateData | null>(null);
  const [workbook, setWorkbook] = useState<WorkBook | null>(null);
  const { uploadData } = useTemplateData();
  const [page, setPage] = useState(0);
  const [sourceName, setSourceName] = useState<string>("");

  const onImport = () => {
    const data = parseSpreadsheet(workbook!, page);
    uploadData({ ...data, sourceName });
    close();
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
    const file = e.target.files?.[0];
    if (!file) return setTemplateData(null);
    const data = await file.arrayBuffer();
    const wb = read(data);
    setWorkbook(wb);
    setSourceName(file.name);
  };

  const parsedData = workbook ? parseSpreadsheet(workbook, page) : null;

  return (
    <div className="h-[calc(100vh_-_300px)] w-full grid grid-rows-[auto,_minmax(0,_1fr)]">
      <div className="bg-zinc-900 p-4">
        <p className="text-zinc-200"></p>
        <div className="flex flex-row justify-between">
          <div>
            <label
              htmlFor="input"
              className="border-[2px] border-white rounded-lg py-3 px-6 hover:bg-white/10 cursor-pointer block w-fit text-white"
            >
              {dataSource ? "Change Spreadsheet" : "Select file"}
            </label>
            <input
              id="input"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={onFileChange}
              className="hidden"
            />
          </div>
          <div className="flex items-end gap-4">
            {parsedData && (
              <Button onClick={onImport} className="h-10 w-24">
                Import
              </Button>
            )}
            {workbook && (
              <SheetSelector
                sheets={workbook.SheetNames}
                currentIndex={page}
                setSheet={setPage}
              />
            )}
          </div>
        </div>
      </div>
      <div className="h-full">{parsedData && <DisplayPage data={parsedData} />}</div>
    </div>
  );
}

function SheetSelector({
  sheets,
  currentIndex,
  setSheet,
}: {
  sheets: string[];
  currentIndex: number;
  setSheet: (idx: number) => void;
}) {
  const options = sheets.map((sheetName, idx) => ({ id: String(idx), value: sheetName }));

  const onChange = (idxStr: string) => {
    const idx = Number(idxStr);
    setSheet(idx);
  };

  const id = useId();

  return (
    <div className="min-w-32">
      <Label htmlFor={id}>Select sheet</Label>
      <SelectMenu id={id} options={options} value={String(currentIndex)} onChange={onChange} />
    </div>
  );
}

function DisplayPage({ data }: { data: DataSource }) {
  const body = data.bodyData.slice(0, 20);
  const headers = data.headers;
  const columnCount = headers.length;

  const renderHeaders = () => {
    return headers.map(header => (
      <div className="bg-zinc-700 text-white font-bold py-1 px-2 border-[1px] border-zinc-500">
        {header?.value}
      </div>
    ));
  };

  const renderBody = () => {
    return body.map((row, rowIndex) => (
      <div
        key={`row-${rowIndex}`}
        className="grid grid-flow-col"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      >
        {row.map((value, columnIndex) => {
          return (
            <div
              key={`row-${rowIndex}-column-${columnIndex}`}
              className="border-[1px] border-zinc-200 w-full py-1 px-2 truncate"
            >
              {value?.value}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="overflow-y-auto h-full">
      <div
        className="grid grid-flow-col"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      >
        {renderHeaders()}
      </div>
      <div className="grid grid-flow-row">{renderBody()}</div>
    </div>
  );
}

function parseSpreadsheet(workbook: WorkBook, page: number): DataSource {
  const firstSheet = workbook.Sheets[workbook.SheetNames[page]];
  const json = utils.sheet_to_json(firstSheet, { header: 1, blankrows: false });
  const headers: Headers[] = parseHeaders(json[0] as string[]);
  const bodyData: BodyData[] = parseBody(json.slice(1) as string[][], headers.length);

  return {
    headers,
    bodyData,
    dateUploaded: new Date(),
    sourceName: workbook.Props?.Title || "spreadsheet",
  };
}

function parseHeaders(headers: string[]): Headers[] {
  const arr: Headers[] = [];
  let untitled = 1;
  for (let i = 0; i < headers.length; i++) {
    const value = String(headers[i]);
    if (!value) {
      arr.push({ value: "untitled-" + untitled });
      untitled++;
      continue;
    }
    arr.push({ value });
  }
  return arr;
}

function parseBody(body: string[][], columnCount: number): BodyData[] {
  const arr: BodyData[] = [];
  for (let i = 0; i < body.length; i++) {
    const rowData = body[i];
    const row = [];
    for (let j = 0; j < columnCount; j++) {
      const value = rowData[j];
      const parsedValue = value ? { value: String(value) } : null;
      row.push(parsedValue);
    }
    arr.push(row);
  }
  return arr.filter(row => !row.every(cell => !cell?.value));
}

export default LoadWorkbook;
