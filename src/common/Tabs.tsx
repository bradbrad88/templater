import React from "react";
import { cn } from "../utils/cn";

export type Tab = { name: string; href: string; current: boolean };

type Props = {
  tabs: Tab[];
  onChange: (href: string) => void;
};

export default function Tabs({ tabs, onChange }: Props) {
  const onClick: React.MouseEventHandler = e => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("data-href");
    if (!href) throw new Error("data-href attribute does not exist on Tabs anchor element");
    onChange(href);
  };

  return (
    <nav className="-mb-px grid grid-flow-col w-full gap-8" aria-label="Tabs">
      {tabs.map(tab => (
        <a
          key={tab.name}
          onClick={onClick}
          data-href={tab.href}
          className={cn(
            tab.current
              ? "text-indigo-800 hover:text-zinc-700"
              : "text-zinc-700 hover:text-zinc-700",
            "px-1 py-1.5 text-sm font-medium cursor-pointer visited:text-zinc-700 text-center flex flex-col items-center select-none"
          )}
          aria-current={tab.current ? "page" : undefined}
        >
          {tab.name}
          {tab.current && <div className="mt-1 w-4 h-1 bg-indigo-600 rounded-full"></div>}
        </a>
      ))}
    </nav>
  );
}
