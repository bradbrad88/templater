import { Link, To } from "react-router-dom";

const navItems: Parameters<typeof Navitem>[0][] = [{ display: "Templates", to: "/templates" }];

function Navbar() {
  return (
    <nav>
      {navItems.map(item => (
        <Navitem {...item} key={item.display} />
      ))}
    </nav>
  );
}

export default Navbar;

function Navitem({ display, to }: { display: string; to: To }) {
  return <Link to={to}>{display}</Link>;
}
