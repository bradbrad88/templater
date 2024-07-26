import Button from "common/Button";
import ModalDialog from "common/ModalDialog";
import { XIcon } from "common/icons";
import LoadWorkbook from "features/importData/LoadWorkbook";
import { useImportData } from "features/importData/useImportData";
import { Link, To } from "react-router-dom";
import useToggleModal from "src/hooks/useToggleModal";

const navItems: Parameters<typeof Navitem>[0][] = [{ display: "Templates", to: "/templates" }];

function Navbar() {
  return (
    <nav className="flex justify-between w-full">
      <div className="flex flex-row items-center">
        {navItems.map(item => (
          <Navitem {...item} key={item.display} />
        ))}
      </div>
      <SpreadSheetLoader />
    </nav>
  );
}

export default Navbar;

function Navitem({ display, to }: { display: string; to: To }) {
  return (
    <Link to={to} className="h-fit">
      <Button className="bg-zinc-800 border-white py-2 h-fit">{display}</Button>
    </Link>
  );
}

function SpreadSheetLoader() {
  const [open, setOpen] = useToggleModal("load-spreadsheet");
  const { data, removeData } = useImportData();

  return (
    <div className="flex items-center gap-4">
      {data && (
        <div className="relative flex items-center h-full bg-white/10 rounded-full text-sm px-4  select-none">
          {data.sourceName}
          <span
            onClick={removeData}
            className="absolute w-5 h-5 border-[1px] border-red-400 -right-2 -top-2 flex items-center justify-center fill-red-400 hover:fill-red-600 rounded-full hover:border-red-600 cursor-pointer bg-black hover:bg-white transition-colors duration-200"
          >
            <XIcon size={10} className="" />
          </span>
        </div>
      )}
      <Button onClick={() => setOpen(true)} className="h-fit py-2 bg-white text-black">
        {data ? "Change Spreadsheet" : "Upload Spreadsheet"}
      </Button>
      <ModalDialog open={open} setOpen={setOpen}>
        <LoadWorkbook close={() => setOpen(false)} />
      </ModalDialog>
    </div>
  );
}
