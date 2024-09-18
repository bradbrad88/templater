import { NavLink, To } from "react-router-dom";
import { cn } from "utils/cn";

function RibbonControls() {
  const tabs = [
    { name: "Edit", href: "edit" },
    { name: "Data", href: "data" },
    { name: "Preview", href: "preview" },
  ];

  return (
    <div className="flex w-full h-20 border-b-[2px] border-zinc-200 px-4 gap-4 items-center">
      {tabs.map(tab => (
        <Link to={tab.href} key={tab.href}>
          {tab.name}
        </Link>
      ))}
    </div>
  );
}

function Link({ children, to }: { children: React.ReactNode; to: To }) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div
          className={cn(
            isActive && "bg-indigo-300",
            "p-2 px-6 rounded-full hover:border-lime-400 border-[1px] border-indigo-200"
          )}
        >
          {children}
        </div>
      )}
    </NavLink>
  );
}

export default RibbonControls;
