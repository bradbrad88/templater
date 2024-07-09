import React, { useState } from "react";
import { read } from "xlsx";
import Workbook from "./Workbook";

import type { WorkBook } from "xlsx";

function App() {
  const [wb, setWb] = useState<WorkBook | null>(null);
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
    const file = e.target.files?.[0];
    if (!file) return setWb(null);
    const data = await file.arrayBuffer();
    const wb = read(data, { dense: true });
    setWb(wb);
  };

  return (
    <div>
      <div className="bg-zinc-900 p-4 print:hidden">
        <label
          htmlFor="input"
          className="border-[2px] border-white rounded-lg py-3 px-6 hover:bg-white/10 cursor-pointer block w-fit text-white"
        >
          Upload Spreadsheet
        </label>
        <input
          id="input"
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
      {wb && <Workbook workbook={wb} />}
    </div>
  );
}

export default App;
