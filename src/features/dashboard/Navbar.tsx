import Button from "common/Button";
import ModalDialog from "common/ModalDialog";
import LoadWorkbook from "features/importData/LoadWorkbook";
import { useImportData } from "features/importData/useImportData";
import { Link, To } from "react-router-dom";
import useToggleModal from "src/hooks/useToggleModal";

const navItems: Parameters<typeof Navitem>[0][] = [{ display: "Templates", to: "/templates" }];

function Navbar() {
  return (
    <nav className="flex justify-between w-full print:hidden">
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
  const { data } = useImportData();

  return (
    <div className="flex items-center gap-2">
      {data && <div className="">{data.sourceName}</div>}
      <Button onClick={() => setOpen(true)} className="h-fit py-2 bg-white text-black">
        Upload Spreadsheet
      </Button>
      <ModalDialog open={open} setOpen={setOpen}>
        <LoadWorkbook />
      </ModalDialog>
    </div>
  );
}
