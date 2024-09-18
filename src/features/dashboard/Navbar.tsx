import Button from "common/Button";
import { Link, To } from "react-router-dom";

const navItems: Parameters<typeof Navitem>[0][] = [{ display: "Templates", to: "/templates" }];

function Navbar() {
  return (
    <nav className="flex justify-between w-full">
      <div className="flex flex-row items-center">
        {navItems.map(item => (
          <Navitem {...item} key={item.display} />
        ))}
      </div>
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
